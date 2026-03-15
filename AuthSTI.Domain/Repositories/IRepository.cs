using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Domain.Repositories
{
    public interface IRepository<T> where T : EntityBase
    {
        T Get(Guid id);

        IQueryable<T> Query();

        void Save(T entity);

        void Update(T entity);

        void Delete(T entity);
    }

}
