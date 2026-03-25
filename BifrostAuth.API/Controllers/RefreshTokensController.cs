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
    public class RefreshTokensController : ControllerBase
    {
        private readonly IRefreshTokenService _service;

        public RefreshTokensController(IRefreshTokenService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IReadOnlyCollection<RefreshTokenDto>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id:guid}")]
        public ActionResult<RefreshTokenDto> Get(Guid id) => Ok(_service.Get(id));

        [HttpGet("getOData")]
        [EnableQuery]
        public IQueryable<RefreshTokenDto> GetOData()
        {
            return _service.Get();
        }

        [HttpPost]
        public IActionResult Create([FromBody] RefreshTokenDto dto)
        {
            _service.Save(dto);
            return Ok();
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, [FromBody] RefreshTokenDto dto)
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
