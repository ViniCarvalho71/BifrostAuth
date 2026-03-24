using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace BifrostAuth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _service;

        public ApplicationsController(IApplicationService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IReadOnlyCollection<ApplicationDto>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id:guid}")]
        public ActionResult<ApplicationDto> Get(Guid id) => Ok(_service.Get(id));

        [HttpPost]
        public IActionResult Create([FromBody] ApplicationDto dto)
        {
            _service.Save(dto);
            return Ok();
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, [FromBody] ApplicationDto dto)
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
