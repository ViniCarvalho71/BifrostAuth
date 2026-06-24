using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.Persistence.Repositories
{
    public class Repository<T> : IRepository<T> where T : EntityBase
    {
        private readonly ISession _session;

        public Repository(ISession session)
        {
            _session = session;
        }

        public void Save(T entity)
        {
            using var transaction = _session.BeginTransaction();

            try
            {
                _session.Save(entity);
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public void Update(T entity)
        {
            using var transaction = _session.BeginTransaction();

            try
            {
                _session.Update(entity);
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public void Delete(T entity)
        {
            using var transaction = _session.BeginTransaction();

            try
            {
                _session.Delete(entity);
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public T Get(Guid id)
        {
            return _session.Get<T>(id);
        }

        public IQueryable<T> Query()
        {
            return _session.Query<T>();
        }

        
    }
}

