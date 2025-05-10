using Microsoft.AspNetCore.Mvc;
using ToDoApi.Data;
using ToDoApi.Models;
using ToDoApi.Services; // Adicione o namespace do TokenService

namespace ToDoApi.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;  // Declara o TokenService

        // Injeção de dependência no construtor
        public AuthController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario model, [FromServices] AppDbContext context)
        {
            var usuario = context.Usuarios.FirstOrDefault(x => x.Email == model.Email && x.Senha == model.Senha);
            if (usuario == null) return Unauthorized();

            // Chama o método GenerateToken através da instância injetada
            var token = _tokenService.GenerateToken(usuario);
            return Ok(new { token });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] Usuario model, [FromServices] AppDbContext context)
        {
            context.Usuarios.Add(model);
            context.SaveChanges();
            return Created("", model);
        }
    }
}

