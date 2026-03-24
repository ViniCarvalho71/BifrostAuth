using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace BifrostAuth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditsController : ControllerBase
    {
        private readonly IAuditService _service;

        public AuditsController(IAuditService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IReadOnlyCollection<AuditDto>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id:guid}")]
        public ActionResult<AuditDto> Get(Guid id) => Ok(_service.Get(id));

        [HttpPost]
        public IActionResult Create([FromBody] AuditDto dto)
        {
            _service.Save(dto);
            return Ok();
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, [FromBody] AuditDto dto)
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
