using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ToDoApi.Data;
using ToDoApi.Repositories;
using ToDoApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()); 
});

// Configuração do Kestrel para HTTPS
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000); // Porta HTTP
    options.ListenAnyIP(5001, listenOptions =>
    {
        listenOptions.UseHttps(); // Porta HTTPS
    });
});

// Configuração do banco de dados MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Registrando o repositório
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ITarefaRepository, TarefaRepository>();


// Registrando o TokenService
builder.Services.AddSingleton<TokenService>();

// Configuração da autenticação com JWT

builder.Services.AddAuthentication("Bearer")
.AddJwtBearer("Bearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
    };
});

// Adicionando autorização
builder.Services.AddAuthorization();

// Adicionando os controllers
builder.Services.AddControllers();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseCors("AllowFrontend");     // 1º: trate CORS
app.UseAuthentication();          // 3º: agora autenticação/autorização
app.UseAuthorization();
app.MapControllers();

app.Run();
 