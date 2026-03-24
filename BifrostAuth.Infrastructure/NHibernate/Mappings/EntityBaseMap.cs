using BifrostAuth.Models;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.NHibernate.Mappings
{
    public class EntityBaseMap<T> : ClassMap<T> where T : EntityBase
    {
        public EntityBaseMap()
        {
            Id(x => x.Id)
                .CustomSqlType("uuid");


            Map(x => x.CreatedAt)
           .Not.Nullable();

            Map(x => x.UpdatedAt)
                .Not.Nullable();
        }
    }
}
