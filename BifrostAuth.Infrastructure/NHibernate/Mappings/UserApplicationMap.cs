using BifrostAuth.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.NHibernate.Mappings
{
    public class UserApplicationMap : EntityBaseMap<UserApplication>
    {

        public UserApplicationMap()
        {
            Table("UserApplications");

            Map(x => x.UserId)
                .Column("UserId")
                .CustomSqlType("uuid")
                .Not.Nullable();

            Map(x => x.ApplicationId)
                .Column("ApplicationId")
                .CustomSqlType("uuid")
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
