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
    private int ObterUsuarioId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : throw new UnauthorizedAccessException("Usuário não autenticado.");
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromServices] ITarefaRepository repo)
    {
        var usuarioId = ObterUsuarioId();
        var tarefas = await repo.GetByUsuarioAsync(usuarioId);
        return Ok(tarefas);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Tarefa model, [FromServices] ITarefaRepository repo)
    {
        var usuarioId = ObterUsuarioId();
        model.UsuarioId = usuarioId;

        var novaTarefa = await repo.AddAsync(model);
        return CreatedAtAction(nameof(Get), new { id = novaTarefa.Id }, novaTarefa);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Tarefa model, [FromServices] ITarefaRepository repo)
    {
        var usuarioId = ObterUsuarioId();
        model.Id = id;
        model.UsuarioId = usuarioId;

        var updated = await repo.UpdateAsync(model);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, [FromServices] ITarefaRepository repo)
    {
        var usuarioId = ObterUsuarioId();
        var result = await repo.DeleteAsync(id, usuarioId);
        return result ? NoContent() : NotFound();
    }
}
