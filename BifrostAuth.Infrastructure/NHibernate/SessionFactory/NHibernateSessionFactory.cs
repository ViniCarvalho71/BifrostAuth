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

        public static ISessionFactory Build(
            string connectionString,
            bool enableSchemaUpdate = false,
            bool showSql = false,
            bool formatSql = false,
            int adoNetBatchSize = 20)
        {
            if (_sessionFactory != null)
                return _sessionFactory;

            var dbConfig = PostgreSQLConfiguration.Standard
                .ConnectionString(connectionString)
                .AdoNetBatchSize(adoNetBatchSize);

            if (showSql)
                dbConfig = dbConfig.ShowSql();

            if (formatSql)
                dbConfig = dbConfig.FormatSql();

            var fluent = Fluently.Configure()
                .Database(dbConfig)
                .Mappings(m =>
                    m.FluentMappings.AddFromAssemblyOf<UserMap>())
                ;

            if (enableSchemaUpdate)
            {
                fluent = fluent.ExposeConfiguration(cfg =>
                {
                    new SchemaUpdate(cfg).Execute(false, true);
                });
            }

            _sessionFactory = fluent.BuildSessionFactory();

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
