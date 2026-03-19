using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class RefreshTokenMap : EntityBaseMap<RefreshToken>
    {
        public RefreshTokenMap()
        {
            Table("RefreshTokens");

            Map(x => x.UserId)
                .CustomSqlType("char(36)")
                .Not.Nullable();

            Map(x => x.Token)
                .Length(500)
                .Not.Nullable();

            Map(x => x.ExpiresAt)
                .Not.Nullable();

            Map(x => x.RevokedAt)
                .Nullable();

            Map(x => x.ReplacedByToken)
                .Length(500)
                .Nullable();

            Map(x => x.CreatedByIp)
                .Length(50)
                .Nullable();

            References(x => x.User)
                .Column("UserId")
                .Not.Nullable()
                .Not.Insert()
                .Not.Update();
        }
    }
}
