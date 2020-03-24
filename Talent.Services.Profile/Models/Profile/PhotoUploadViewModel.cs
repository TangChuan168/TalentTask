using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Talent.Services.Profile.Models.Profile
{
    public class PhotoUploadViewModel
    {

        public IFormFile File { get; set; }
    }
}
