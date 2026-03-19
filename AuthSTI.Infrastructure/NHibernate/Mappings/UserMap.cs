using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class UserMap : EntityBaseMap<User>
    {
        public UserMap()
        {
            Table("Users");

            Map(x => x.Login)
                .Length(100)
                .Not.Nullable();

            Map(x => x.Email)
                .Length(200)
                .Not.Nullable();

            Map(x => x.PasswordHash)
                .Length(500)
                .Not.Nullable();

            HasMany(x => x.UserRoles)
                .KeyColumn("UserId")
                .Cascade.All()
                .Inverse();

            HasMany(x => x.UserApplications)
                .KeyColumn("UserId")
                .Cascade.All()
                .Inverse();


            HasMany(x => x.RefreshTokens)
                .KeyColumn("UserId")
                .Cascade.All()
                .Inverse();
        }
    }
}
