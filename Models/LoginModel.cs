using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoApi.Models
{
    public class LoginModel
    {
        public string Email { get; set; }
        public string Senha { get; set; }
        public LoginModel(string email, string senha)
        {
            Email = email;
            Senha = senha ?? throw new ArgumentNullException(nameof(senha), "Senha não pode ser nula");
        }
    }
}