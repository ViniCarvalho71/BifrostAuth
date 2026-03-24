using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.NHibernate.Mappings
{
    public class AuditMap : EntityBaseMap<Audit>
    {
        public AuditMap()
        {
            Table("Audits");

            Map(x => x.UserId)
                .CustomSqlType("uuid")
                .Not.Nullable();

            Map(x => x.Action)
                .Length(200)
                .Not.Nullable();

            Map(x => x.PreviouValue)
                .Length(2000)
                .Nullable();

            Map(x => x.NewValue)
                .Length(2000)
                .Nullable();
        }
    }
}
