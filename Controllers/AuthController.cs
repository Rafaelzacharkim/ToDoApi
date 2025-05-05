using Microsoft.AspNetCore.Mvc;
using ToDoApi.Data;
using ToDoApi.Models;
using ToDoApi.Services;

namespace ToDoApi.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] Usuario model, [FromServices] AppDbContext context)
    {
        var usuario = context.Usuarios.FirstOrDefault(x => x.Email == model.Email && x.Senha == model.Senha);
        if (usuario == null) return Unauthorized();

        var token = TokenService.GenerateToken(usuario);
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
