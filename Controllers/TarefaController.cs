using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ToDoApi.Models;
using ToDoApi.Repositories;

namespace ToDoApi.Controllers;

[ApiController]
[Route("tarefas")]
[Authorize]
public class TarefaController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromServices] ITarefaRepository repo)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        return Ok(await repo.GetByUsuarioAsync(usuarioId));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Tarefa model, [FromServices] ITarefaRepository repo)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        model.UsuarioId = usuarioId;
        return Created("", await repo.AddAsync(model));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Tarefa model, [FromServices] ITarefaRepository repo)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        model.Id = id;
        model.UsuarioId = usuarioId;
        var updated = await repo.UpdateAsync(model);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, [FromServices] ITarefaRepository repo)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        return await repo.DeleteAsync(id, usuarioId) ? NoContent() : NotFound();
    }
}
