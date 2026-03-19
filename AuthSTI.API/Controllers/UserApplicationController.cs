using AuthSTI.Application.Dtos;
using AuthSTI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AuthSTI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserApplicationController : ControllerBase
    {
        private readonly IUserApplicationService _service;

        public UserApplicationController(IUserApplicationService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IReadOnlyCollection<UserApplicationDto>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id:guid}")]
        public ActionResult<UserApplicationDto> Get(Guid id) => Ok(_service.Get(id));

        [HttpPost]
        public IActionResult Create([FromBody] UserApplicationDto dto)
        {
            _service.Save(dto);
            return Ok();
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, [FromBody] UserApplicationDto dto)
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
