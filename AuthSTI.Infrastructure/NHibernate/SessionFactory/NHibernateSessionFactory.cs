using AuthSTI.Infrastructure.NHibernate.Mappings;
using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.SessionFactory
{
    public class NHibernateSessionFactory
    {
        private static ISessionFactory? _sessionFactory;

        public static ISessionFactory Build(string connectionString)
        {
            if (_sessionFactory != null)
                return _sessionFactory;

            _sessionFactory = Fluently.Configure()
                .Database(
                    PostgreSQLConfiguration.Standard
                        .ConnectionString(connectionString)
                        .ShowSql()
                )
                .Mappings(m =>
                    m.FluentMappings.AddFromAssemblyOf<UserMap>())
                .BuildSessionFactory();

            return _sessionFactory;
        }
}
