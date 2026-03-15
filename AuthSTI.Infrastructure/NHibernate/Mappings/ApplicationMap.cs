using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class ApplicationMap : EntityBaseMap<Application>
    {
        public ApplicationMap()
        {
            Table("Applications");

            Map(x => x.Name)
                .Length(200)
                .Not.Nullable();

            Map(x => x.ClientId)
                .Length(200)
                .Not.Nullable();

            Map(x => x.ClientSecret)
                .Length(500)
                .Not.Nullable();

            Map(x => x.RedirectUrl)
                .Length(500)
                .Nullable();

            Map(x => x.IsActive)
                .Not.Nullable();
        }
    }
}
