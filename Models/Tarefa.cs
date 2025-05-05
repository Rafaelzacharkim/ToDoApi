namespace ToDoApi.Models;

public class Tarefa
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool Concluida { get; set; } = false;

    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
}
