using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DropZone.Demo.Models;

namespace DropZone.Demo.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private string fileName = "";

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [HttpPost]
        public async Task<HttpResponseMessage> UploadChunk(DropZoneDto model)
        {
            if (fileName == model.FileName)
            {

            }
            else
            {
                fileName = model.FileName;
            }
            var response = new HttpResponseMessage { StatusCode = HttpStatusCode.Created };
            try
            {
                var path = $@"~/EasyUpload/{model.Uuid}";
                Directory.CreateDirectory(path);

                using (var stream = HttpContext.Request.Form.Files[0].OpenReadStream())
                {
                    stream.Position = 0;
                    using (var fileStream = System.IO.File.Create($@"~/EasyUpload/{model.Uuid}/{model.FileName}"))
                    {
                        stream.CopyTo(fileStream);
                    }
                }
            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                return response;
            }

            return response;
        }

        [HttpPost]
        public async Task<IActionResult> ChunksComplete()
        {
            return Ok();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


    }



    public class DropZoneDto
    {
        public string FileName { get; set; }
        public string Uuid { get; set; }
    }
}
