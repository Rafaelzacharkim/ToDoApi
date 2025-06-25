using Microsoft.AspNetCore.Mvc;
using ToDoApi.Data;
using ToDoApi.Models;
using ToDoApi.Services; // Adicione o namespace do TokenService
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ToDoApi.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;  

        public AuthController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario model, [FromServices] AppDbContext context)
        {
            var usuario = context.Usuarios.FirstOrDefault(x => x.Email == model.Email && x.Senha == model.Senha);
            if (usuario == null) return Unauthorized();

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

        [Authorize]
        [HttpPut("nome")]
        public IActionResult AtualizarNome([FromBody] string novoNome, [FromServices] AppDbContext context)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var usuario = context.Usuarios.FirstOrDefault(x => x.Id == int.Parse(userId));
            if (usuario == null) return NotFound();

            usuario.Nome = novoNome;
            context.SaveChanges();

            return Ok(new { message = "Nome atualizado com sucesso." });
        }
        

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser([FromServices] AppDbContext context)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var usuario = context.Usuarios.FirstOrDefault(x => x.Id == int.Parse(userId));
            if (usuario == null) return NotFound();

            return Ok(new { nome = usuario.Nome, email = usuario.Email });
        }


        [Authorize]
        [HttpDelete]
        public IActionResult DeletarConta([FromServices] AppDbContext context)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var usuario = context.Usuarios.FirstOrDefault(x => x.Id == int.Parse(userId));
            if (usuario == null) return NotFound();

            context.Usuarios.Remove(usuario);
            context.SaveChanges();

            return Ok(new { message = "Conta excluída com sucesso." });
        }

        [Authorize]
        [HttpPut("update")]
        public IActionResult UpdateUser([FromBody] UpdateUserModel model, [FromServices] AppDbContext context)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var usuario = context.Usuarios.FirstOrDefault(x => x.Id == int.Parse(userId));
            if (usuario == null) return NotFound();

            if (usuario.Senha != model.SenhaAtual)
            {
                return Unauthorized(new { message = "Senha atual incorreta." });
            }

            if (!string.IsNullOrEmpty(model.Nome))
            {
                usuario.Nome = model.Nome;
            }

            if (!string.IsNullOrEmpty(model.Email))
            {
                var emailExists = context.Usuarios.Any(x => x.Email == model.Email && x.Id != usuario.Id);
                if (emailExists)
                {
                    return Conflict(new { message = "O novo e-mail já está em uso." });
                }
                usuario.Email = model.Email;
            }

            context.SaveChanges();

            return Ok(new { message = "Dados atualizados com sucesso!" });
        }
    }
}