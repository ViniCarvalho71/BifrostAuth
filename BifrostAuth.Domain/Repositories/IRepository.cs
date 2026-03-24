using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Domain.Repositories
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
