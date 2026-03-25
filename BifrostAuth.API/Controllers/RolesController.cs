using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using System;
using System.Collections.Generic;

namespace BifrostAuth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _service;

        public RolesController(IRoleService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IReadOnlyCollection<RoleDto>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id:guid}")]
        public ActionResult<RoleDto> Get(Guid id) => Ok(_service.Get(id));

        [HttpGet("getOData")]
        [EnableQuery]
        public IQueryable<RoleDto> GetOData()
        {
            return _service.Get();
        }

        [HttpPost]
        public IActionResult Create([FromBody] RoleDto dto)
        {
            _service.Save(dto);
            return Ok();
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, [FromBody] RoleDto dto)
        {
            dto.Id = id;
            _service.Update(dto);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public IActionResult Delete(Guid id)
        {
            _service.Delete(id);
            return NoContent();
        }
    }
}
