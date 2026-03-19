using AuthSTI.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class UserApplicationMap : EntityBaseMap<UserApplication>
    {

        public UserApplicationMap()
        {
            Table("UserApplications");

            Map(x => x.UserId)
                .Column("UserId")
                .CustomSqlType("char(36)")
                .Not.Nullable();

            Map(x => x.ApplicationId)
                .Column("ApplicationId")
                .CustomSqlType("char(36)")
                .Not.Nullable();

            References(x => x.User)
                .Column("UserId")
                .Not.Insert()
                .Not.Update()
                .ForeignKey("FK_UserApplication_User")
                .Not.Nullable();

            References(x => x.Application)
                .Column("ApplicationId")
                .Not.Insert()
                .Not.Update()
                .ForeignKey("FK_UserApplication_Application")
                .Not.Nullable();
        }
    }
}
