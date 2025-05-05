using ToDoApi.Models;

namespace ToDoApi.Repositories;

public interface ITarefaRepository
{
    Task<List<Tarefa>> GetByUsuarioAsync(int usuarioId);
    Task<Tarefa?> GetByIdAsync(int id, int usuarioId);
    Task<Tarefa> AddAsync(Tarefa tarefa);
    Task<Tarefa?> UpdateAsync(Tarefa tarefa);
    Task<bool> DeleteAsync(int id, int usuarioId);
}
