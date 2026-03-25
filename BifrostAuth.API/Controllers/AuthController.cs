using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BifrostAuth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var response = _authService.Login(loginDto.Email, loginDto.Password, loginDto.ClientId);
                return Ok(new { token = response} );

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
