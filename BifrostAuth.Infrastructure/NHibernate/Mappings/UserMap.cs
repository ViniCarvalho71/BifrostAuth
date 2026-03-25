using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.NHibernate.Mappings
{
    public class UserMap : EntityBaseMap<User>
    {
        public UserMap()
        {
            Table("Users");

            Map(x => x.Login)
                .Length(100)
                .Unique()
                .Not.Nullable();

            Map(x => x.Email)
                .Length(200).
                 Unique()
                .Not.Nullable();

            Map(x => x.Password)
                .Length(500)
                .Not.Nullable();

            Map(x => x.IsActive)
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
