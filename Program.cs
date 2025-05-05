using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ToDoApi.Data;
using ToDoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Conexão com o MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Autenticação JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("sua-chave-jwt-ultra-secreta"))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "ToDo API funcionando!").AllowAnonymous();
// CRUD - USUÁRIOS

app.MapPost("/usuarios", async (Usuario usuario, AppDbContext db) =>
{
    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();
    return Results.Created($"/usuarios/{usuario.Id}", usuario);
});

app.MapGet("/usuarios", async (AppDbContext db) =>
    await db.Usuarios.ToListAsync());

app.MapGet("/usuarios/{id}", async (int id, AppDbContext db) =>
    await db.Usuarios.FindAsync(id) is Usuario usuario
        ? Results.Ok(usuario)
        : Results.NotFound());

app.MapPut("/usuarios/{id}", async (int id, Usuario inputUsuario, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario is null) return Results.NotFound();

    usuario.Nome = inputUsuario.Nome;
    usuario.Email = inputUsuario.Email;
    usuario.Senha = inputUsuario.Senha;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/usuarios/{id}", async (int id, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario is null) return Results.NotFound();

    db.Usuarios.Remove(usuario);
    await db.SaveChangesAsync();
    return Results.NoContent();
});


// CRUD - TAREFAS

app.MapPost("/tarefas", async (Tarefa tarefa, AppDbContext db) =>
{
    db.Tarefas.Add(tarefa);
    await db.SaveChangesAsync();
    return Results.Created($"/tarefas/{tarefa.Id}", tarefa);
});

app.MapGet("/tarefas", async (AppDbContext db) =>
    await db.Tarefas.ToListAsync());

app.MapGet("/tarefas/{id}", async (int id, AppDbContext db) =>
    await db.Tarefas.FindAsync(id) is Tarefa tarefa
        ? Results.Ok(tarefa)
        : Results.NotFound());

app.MapPut("/tarefas/{id}", async (int id, Tarefa inputTarefa, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);
    if (tarefa is null) return Results.NotFound();

    tarefa.Titulo = inputTarefa.Titulo;
    tarefa.Concluida = inputTarefa.Concluida;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/tarefas/{id}", async (int id, AppDbContext db) =>
{
    var tarefa = await db.Tarefas.FindAsync(id);
    if (tarefa is null) return Results.NotFound();

    db.Tarefas.Remove(tarefa);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
