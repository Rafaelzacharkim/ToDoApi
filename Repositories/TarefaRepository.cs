using Microsoft.EntityFrameworkCore;
using ToDoApi.Data;
using ToDoApi.Models;

namespace ToDoApi.Repositories;

public class TarefaRepository : ITarefaRepository
{
    private readonly AppDbContext _context;

    public TarefaRepository(AppDbContext context) => _context = context;

    public async Task<List<Tarefa>> GetByUsuarioAsync(int usuarioId) =>
        await _context.Tarefas.Where(t => t.UsuarioId == usuarioId).ToListAsync();

    public async Task<Tarefa?> GetByIdAsync(int id, int usuarioId) =>
        await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id && t.UsuarioId == usuarioId);

    public async Task<Tarefa> AddAsync(Tarefa tarefa)
    {
        _context.Tarefas.Add(tarefa);
        await _context.SaveChangesAsync();
        return tarefa;
    }

    public async Task<Tarefa?> UpdateAsync(Tarefa tarefa)
    {
        var existente = await GetByIdAsync(tarefa.Id, tarefa.UsuarioId);
        if (existente == null) return null;

        existente.Titulo = tarefa.Titulo;
        existente.Descricao = tarefa.Descricao;
        existente.Concluida = tarefa.Concluida;
        await _context.SaveChangesAsync();

        return existente;
    }

    public async Task<bool> DeleteAsync(int id, int usuarioId)
    {
        var tarefa = await GetByIdAsync(id, usuarioId);
        if (tarefa == null) return false;

        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();
        return true;
    }
}
