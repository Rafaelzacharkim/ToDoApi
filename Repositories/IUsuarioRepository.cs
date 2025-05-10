using ToDoApi.Models;

namespace ToDoApi.Repositories
{
    public interface IUsuarioRepository
    {
        Task<Usuario> GetByEmailAsync(string email);
        Task<Usuario> AddAsync(Usuario usuario);
        Task<IEnumerable<Usuario>> GetAllAsync(); // Adicione este método
        Task<Usuario> GetByIdAsync(int id); // Adicione este método
        Task<Usuario> UpdateAsync(Usuario usuario); // Adicione este método
        Task<bool> DeleteAsync(int id); // Adicione este método
        Task<Usuario> GetByEmailSenhaAsync(string email, string senha); // Adicione este método
    }
}
