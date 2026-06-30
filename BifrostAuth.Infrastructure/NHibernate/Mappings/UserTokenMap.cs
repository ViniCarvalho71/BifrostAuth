using BifrostAuth.Domain.Models;

namespace BifrostAuth.Infrastructure.NHibernate.Mappings
{
    public class UserTokenMap : EntityBaseMap<UserToken>
    {
        public UserTokenMap()
        {
            Table("UserTokens");

            Map(x => x.UserId)
                .CustomSqlType("uuid")
                .Not.Nullable();

            Map(x => x.TokenType)
                .CustomType<int>()
                .Not.Nullable();

            Map(x => x.TokenHash)
                .Length(64)
                .Not.Nullable();

            Map(x => x.UsedAt)
                .Nullable();

            Map(x => x.ExpiresAt)
                .Not.Nullable();
        }
    }
}