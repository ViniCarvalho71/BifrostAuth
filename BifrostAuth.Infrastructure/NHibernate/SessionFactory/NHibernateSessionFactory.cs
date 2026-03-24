using BifrostAuth.Infrastructure.NHibernate.Mappings;
using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using NHibernate.Tool.hbm2ddl;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.NHibernate.SessionFactory
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
                        .FormatSql()
                        .AdoNetBatchSize(20)
                )
                .Mappings(m =>
                    m.FluentMappings.AddFromAssemblyOf<UserMap>())
                .ExposeConfiguration(cfg =>
                {
                    new SchemaUpdate(cfg).Execute(false, true);
                })
                .BuildSessionFactory();

            return _sessionFactory;
        }

        public static ISession OpenSession()
        {
            if (_sessionFactory == null)
                throw new InvalidOperationException("SessionFactory não foi inicializada.");

            return _sessionFactory.OpenSession();
        }
    }
}
