﻿using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Common.Security;
using Talent.Services.Profile.Models.Profile;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using RawRabbit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using MongoDB.Driver;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Common.Aws;
using Talent.Services.Profile.Models;

namespace Talent.Services.Profile.Controllers
{
    [Route("profile/[controller]")]
    public class ProfileController : Controller
    {
        private readonly IBusClient _busClient;
        private readonly IAuthenticationService _authenticationService;
        private readonly IProfileService _profileService;
        private readonly IFileService _documentService;
        private readonly IUserAppContext _userAppContext;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<UserLanguage> _userLanguageRepository;
        private readonly IRepository<UserDescription> _personDescriptionRespository;
        private readonly IRepository<UserAvailability> _userAvailabilityRepository;
        private readonly IRepository<UserSkill> _userSkillRepository;
        private readonly IRepository<UserEducation> _userEducationRepository;
        private readonly IRepository<UserCertification> _userCertificationRepository;
        private readonly IRepository<UserLocation> _userLocationRepository;
        private readonly IRepository<Employer> _employerRepository;
        private readonly IRepository<UserDocument> _userDocumentRepository;
        private readonly IHostingEnvironment _environment;
        private readonly IRepository<Recruiter> _recruiterRepository;
        private readonly IAwsService _awsService;
        private readonly string _profileImageFolder;

        private readonly IRepository<UserExperience> _userExperienceRepository; // new

        public ProfileController(IBusClient busClient,
            IProfileService profileService,
            IFileService documentService,
            IRepository<UserExperience> userExperienceRepository,//NEW
            IRepository<User> userRepository,
            IRepository<UserLanguage> userLanguageRepository,
            IRepository<UserDescription> personDescriptionRepository,
            IRepository<UserAvailability> userAvailabilityRepository,
            IRepository<UserSkill> userSkillRepository,
            IRepository<UserEducation> userEducationRepository,
            IRepository<UserCertification> userCertificationRepository,
            IRepository<UserLocation> userLocationRepository,
            IRepository<Employer> employerRepository,
            IRepository<UserDocument> userDocumentRepository,
            IRepository<Recruiter> recruiterRepository,
            IHostingEnvironment environment,
            IAwsService awsService,
            IUserAppContext userAppContext)
        {
            _busClient = busClient;
            _profileService = profileService;
            _documentService = documentService;
            _userAppContext = userAppContext;
            _userRepository = userRepository;
            _personDescriptionRespository = personDescriptionRepository;
            _userLanguageRepository = userLanguageRepository;
            _userAvailabilityRepository = userAvailabilityRepository;
            _userSkillRepository = userSkillRepository;
            _userEducationRepository = userEducationRepository;
            _userCertificationRepository = userCertificationRepository;
            _userLocationRepository = userLocationRepository;
            _employerRepository = employerRepository;
            _userDocumentRepository = userDocumentRepository;
            _recruiterRepository = recruiterRepository;
            _environment = environment;
            _profileImageFolder = "images\\";
            _awsService = awsService;
            _userExperienceRepository = userExperienceRepository;  // new

        }

        #region Talent

        [HttpGet("getProfile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = _userAppContext.CurrentUserId;
            var user = await _userRepository.GetByIdAsync(userId);
            return Json(new { Username = user.FirstName });
        }

        [HttpGet("getProfileById")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> GetProfileById(string uid)
        {
            var userId = uid;
            var user = await _userRepository.GetByIdAsync(userId);
            return Json(new { userName = user.FirstName, createdOn = user.CreatedOn });
        }

        [HttpGet("isUserAuthenticated")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> IsUserAuthenticated()
        {
            if (_userAppContext.CurrentUserId == null)
            {
                return Json(new { IsAuthenticated = false });
            }
            else
            {
                var person = await _userRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                if (person != null)
                {
                    return Json(new { IsAuthenticated = true, Username = person.FirstName, Type = "talent" });
                }
                var employer = await _employerRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                if (employer != null)
                {
                    return Json(new { IsAuthenticated = true, Username = employer.CompanyContact.Name, Type = "employer" });
                }
                var recruiter = await _recruiterRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                if (recruiter != null)
                {
                    return Json(new { IsAuthenticated = true, Username = recruiter.CompanyContact.Name, Type = "recruiter" });
                }
                return Json(new { IsAuthenticated = false, Type = "" });
            }
        }

        [HttpGet("getLanguage")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> GetLanguages()
        {
            //Your code here;
            var userId = _userAppContext.CurrentUserId;
            var languagefind = await _userLanguageRepository.FindAsync(x => x.UserId == userId);
            if (languagefind != null)
            {
                return Json(new { Success = "ture", data = languagefind});
            }
            else
            {
                throw new NotImplementedException();
            }
            
        }

        [HttpPost("findLanguages")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> FindLanguages([FromBody] AddLanguageViewModel language)
        {
            //Your code here;
            
            var languagefind = await _userLanguageRepository.FindAsync(x => x.Id == language.Id);
            if (languagefind != null)
            {
                return Json(new {  data = languagefind });
            }
            else
            {
                return Json(new { message="data not exist" });
            }
            //throw new NotImplementedException();
        }

        [HttpPost("addLanguage")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public ActionResult AddLanguage([FromBody] AddLanguageViewModel language)
        {
            //Your code here;
            //var UId = Guid.NewGuid();
            var objectId = ObjectId.GenerateNewId().ToString();
            var userId = _userAppContext.CurrentUserId;

            var userLang = new UserLanguage()
            {
                Id = objectId,
                UserId = userId,
                Language = language.Name,
                LanguageLevel = language.Level,
            };

            _userLanguageRepository.Add(userLang);

            //throw new NotImplementedException();
            return Json(new { Success = "ture",message="Language added" });
        }

        [HttpPost("updateLanguage")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<ActionResult> UpdateLanguage([FromBody] AddLanguageViewModel language)
        {
            //Your code here;
            if (language != null)
            {
                var userId = _userAppContext.CurrentUserId;
                UserLanguage updateLang = new UserLanguage()
                {
                    Id = language.Id,
                    UserId = userId,
                    Language=language.Name,
                    LanguageLevel=language.Level              
                };
                await _userLanguageRepository.Update(updateLang);
                return Json(new { message = "update is complete" });
            }
            else
            {
                throw new NotImplementedException();
            }
            
        }

        [HttpPost("deleteLanguage")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]

        public async Task<ActionResult> DeleteLanguage([FromBody] AddLanguageViewModel language) 
        {
            //Your code here;

            var LanSearch = _userLanguageRepository.Collection.FirstOrDefault(x => x.Id == language.Id);
            if (LanSearch != null)
            {

                await _userLanguageRepository.Delete(LanSearch);
                return Json(new { message = "data is deleted" });
            }
            else
            {
                return Json(new { message = "data not found" });
            }
            
        }

        [HttpGet("getSkill")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> GetSkills()
        {
            //Your code here;
            var userId = _userAppContext.CurrentUserId;
            var skillfind = await _userSkillRepository.FindAsync(x => x.UserId == userId);
            if (skillfind != null)
            {
                return Json(new { Success = "ture", data = skillfind });
            }
            else
            {
                return Json(new { message = "user not exist" });
            }
        }

        [HttpPost("findSkills")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> findSkills([FromBody] AddSkillViewModel skill)
        {
            //Your code here;

            var skillfind = await _userSkillRepository.FindAsync(x => x.Id == skill.Id);
            if (skillfind != null)
            {
                return Json(new { data = skillfind });
            }
            else
            {
                return Json(new { message = "data not exist" });
            }
            //throw new NotImplementedException();
        }


        [HttpPost("addSkill")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public ActionResult AddSkill([FromBody]AddSkillViewModel skill)
        {
            //Your code here;
            var objectId = ObjectId.GenerateNewId().ToString();
            var userId = _userAppContext.CurrentUserId;

            var userSkill = new UserSkill()
            {
                Id = objectId,
                UserId = userId,
                Skill = skill.Name,
                ExperienceLevel = skill.Level,
            };

            _userSkillRepository.Add(userSkill);

           
            return Json(new { Success = "ture", message = "skill added" });
        }

        [HttpPost("updateSkill")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> UpdateSkill([FromBody]AddSkillViewModel skill)
        {
            //Your code here;
            if (skill != null)
            {
                var userId = _userAppContext.CurrentUserId;
                UserSkill updateskill = new UserSkill()
                {
                    Id = skill.Id,
                    UserId = userId,
                    Skill = skill.Name,
                    ExperienceLevel = skill.Level,
                };
                await _userSkillRepository.Update(updateskill);
                return Json(new { message = "skill update is complete" });
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        [HttpPost("deleteSkill")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> DeleteSkill([FromBody]AddSkillViewModel skill)
        {
            //Your code here;
            var skillSearch = _userSkillRepository.Collection.FirstOrDefault(x => x.Id == skill.Id);
            if (skillSearch != null)
            {              
                await _userSkillRepository.Delete(skillSearch);
                return Json(new { message = "data is deleted" });
            }
            else
            {
                return Json(new { message = "data not found" });
            }
        }

        [HttpPost("deleteEPX")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> deleteEPX([FromBody]ExperienceViewModel model)
        {
            //Your code here;
            var expSearch = _userExperienceRepository.Collection.FirstOrDefault(x => x.Id == model.Id);
            if (expSearch != null)
            {
                await _userExperienceRepository.Delete(expSearch);
                return Json(new { message = "data is deleted" });
            }
            else
            {
                return Json(new { message = "data not found" });
            }
        }

        [HttpGet("getExp")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> getExp()
        {
            //Your code here;
            var userId = _userAppContext.CurrentUserId;
            var expFind = await _userExperienceRepository.FindAsync(x => x.UserId == userId);
            if (expFind != null)
            {
                return Json(new { message = "data found", data = expFind });
            }
            else
            {
                return Json(new { message = "user experience data not exist" });
            }
        }

        [HttpPost("findEXP")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> findEXP([FromBody]ExperienceViewModel userID)
        {
            //Your code here;

            var Userfind = await _userExperienceRepository.FindAsync(x => x.Id == userID.Id);
            if (Userfind != null)
            {
                return Json(new { data = Userfind });
            }
            else
            {
                return Json(new { message = "data not exist" });
            }
            //throw new NotImplementedException();
        }

        [HttpPost("addUserEXP")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public ActionResult addUserEXP([FromBody]ExperienceViewModel model)
        {
            //Your code here;
            var objectId = ObjectId.GenerateNewId().ToString();
            var userId = _userAppContext.CurrentUserId;

            var userEXP = new UserExperience()
            {
                Id = objectId,
                UserId = userId,
                Company = model.Company,
                Position = model.Position,
                Responsibilities = model.Responsibilities,
                Start = model.Start,
                End = model.End
                

            };          
            _userExperienceRepository.Add(userEXP);


            return Json(new { Success = "ture", message = "UserEXP added" });
        }

        [HttpPost("updateEXP")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> updateEXP([FromBody]ExperienceViewModel model)
        {
            //Your code here;
            if (model != null)
            {
                var userId = _userAppContext.CurrentUserId;
                UserExperience updatesmodel = new UserExperience()
                {
                    Id=model.Id,
                    UserId = userId,
                    Company = model.Company,
                    Position = model.Position,
                    Start = model.Start,
                    End = model.End,
                    Responsibilities = model.Responsibilities,
                };
                await _userExperienceRepository.Update(updatesmodel);
                return Json(new { message = "user experience update is complete" });
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        [HttpGet("getCertification")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> getCertification()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("addCertification")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public ActionResult addCertification([FromBody] AddCertificationViewModel certificate)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("updateCertification")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> UpdateCertification([FromBody] AddCertificationViewModel certificate)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("deleteCertification")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> DeleteCertification([FromBody] AddCertificationViewModel certificate)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpGet("getProfileImage")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult getProfileImage(string Id)
        {
            var profileUrl = _documentService.GetFileURL(Id, FileType.ProfilePhoto);
            //Please do logic for no image available - maybe placeholder would be fine
            return Json(new { profilePath = profileUrl });
        }

        [HttpPost("updateProfilePhoto")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<ActionResult> UpdateProfilePhoto()//[FromForm]IFormFile
        {
            IFormFile file = Request.Form.Files[0];  
            
            if (file !=null && file.Length > 0)
            {
                var isSuccess = await _profileService.UpdateTalentPhoto(_userAppContext.CurrentUserId, file);
                return Json(new { message = "update complete" + file.FileName });
            }
            else
            {
                return (Json(new { message = "file is empty" }));
            }
        }

        [HttpPost("updateTalentCV")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<ActionResult> UpdateTalentCV()
        {
            IFormFile file = Request.Form.Files[0];
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("updateTalentVideo")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> UpdateTalentVideo()
        {
            IFormFile file = Request.Form.Files[0];
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpGet("getInfo")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> GetInfo()
        {
            //Your code here;
            throw new NotImplementedException();
        }


        [HttpPost("addInfo")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> AddInfo([FromBody] DescriptionViewModel pValue)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpGet("getEducation")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> GetEducation()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("addEducation")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public IActionResult AddEducation([FromBody]AddEducationViewModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("updateEducation")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> UpdateEducation([FromBody]AddEducationViewModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("deleteEducation")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> DeleteEducation([FromBody] AddEducationViewModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

     
        #endregion

        #region EmployerOrRecruiter

        [HttpGet("getEmployerProfile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "employer, recruiter")] // new
        public async Task<IActionResult> GetEmployerProfile(String id = "", String role = "")
        {
            try
            {
                string userId = String.IsNullOrWhiteSpace(id) ? _userAppContext.CurrentUserId : id;
                string userRole = String.IsNullOrWhiteSpace(role) ? _userAppContext.CurrentRole : role;

                var employerResult = await _profileService.GetEmployerProfile(userId, userRole);

                return Json(new { Success = true, employer = employerResult });
            }
            catch (Exception e)
            {
                return Json(new { Success = false, message = e });
            }
        }

        [HttpPost("saveEmployerProfile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "employer, recruiter")]
        public async Task<IActionResult> SaveEmployerProfile([FromBody] EmployerProfileViewModel employer)
        {
            if (ModelState.IsValid)
            {
                if (await _profileService.UpdateEmployerProfile(employer, _userAppContext.CurrentUserId, _userAppContext.CurrentRole))
                {
                    return Json(new { Success = true });
                }
            }
            return Json(new { Success = false });
        }

        [HttpPost("saveClientProfile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        public async Task<IActionResult> SaveClientProfile([FromBody] EmployerProfileViewModel employer)
        {
            if (ModelState.IsValid)
            {
                //check if employer is client 5be40d789b9e1231cc0dc51b
                var recruiterClients =(await _recruiterRepository.GetByIdAsync(_userAppContext.CurrentUserId)).Clients;

                if (recruiterClients.Select(x => x.EmployerId == employer.Id).FirstOrDefault())
                {
                    if (await _profileService.UpdateEmployerProfile(employer, _userAppContext.CurrentUserId, "employer"))
                    {
                        return Json(new { Success = true });
                    }
                }
            }
            return Json(new { Success = false });
        }

        [HttpPost("updateEmployerPhoto")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "employer, recruiter")]
        public async Task<ActionResult> UpdateEmployerPhoto()
        {
            IFormFile file = Request.Form.Files[0];
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpPost("updateEmployerVideo")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "employer, recruiter")]
        public async Task<IActionResult> UpdateEmployerVideo()
        {
            IFormFile file = Request.Form.Files[0];
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpGet("getEmployerProfileImage")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "employer, recruiter")]
        public async Task<ActionResult> GetWorkSample(string Id)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        [HttpGet("getEmployerProfileImages")]
        public ActionResult GetWorkSampleImage(string Id)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        #endregion

        #region TalentFeed

        [HttpGet("getTalentProfile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent, employer, recruiter")]
        public async Task<IActionResult> GetTalentProfile(String id = "")
        {
            String talentId = String.IsNullOrWhiteSpace(id) ? _userAppContext.CurrentUserId : id;
            var userProfile = await _profileService.GetTalentProfile(talentId);
            //var photoview = Path.Combine(_environment.WebRootPath, "/images/", userProfile.ProfilePhoto);
            return Json(new { Success = true, data = userProfile });
        }

        [HttpPost("updateTalentProfile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "talent")]
        public async Task<IActionResult> UpdateTalentProfile([FromBody]TalentProfileViewModel profile)
        {
            //var objectId = ObjectId.GenerateNewId().ToString();
            

            if (ModelState.IsValid)
            {
                if (await _profileService.UpdateTalentProfile(profile, _userAppContext.CurrentUserId))
                {
                    return Json(new { Success = true });
                }
            }
            return Json(new { Success = false });
        }

        [HttpGet("getTalent")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter, employer")] // new
        public IActionResult GetTalentSnapshots()// FeedIncrementModel feed
        {
            //async Task<IActionResult>
            // var result = (await _profileService.GetTalentSnapshotList(_userAppContext.CurrentUserId, false,0, 5)).ToList();

            // Dummy talent to fill out the list once we run out of data
            //if (result!=null)
            //{
            var data = new TalentSnapshotViewModel
                {
                    CurrentEmployment = "Software Developer at XYZ",
                    Level = "Junior",
                    Name = "Dummy User1...",
                    PhotoId = "",
                    Skills = new List<string> { "C#", ".Net Core", "Javascript", "ReactJS", "PreactJS" },
                    Summary = "Veronika Ossi is a set designer living in New York who enjoys kittens, music, and partying.",
                    Visa = "Citizen"
                };

            return Json(new { Success = true, Data = data });
        }
        #endregion

        #region TalentMatching

        [HttpGet("getTalentList")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        public async Task<IActionResult> GetTalentListAsync()
        {
            try
            {
                var result = await _profileService.GetFullTalentList();
                return Json(new { Success = true, Data = result });
            }
            catch (MongoException e)
            {
                return Json(new { Success = false, e.Message });
            }
        }

        [HttpGet("getEmployerList")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        public IActionResult GetEmployerList()
        {
            try
            {
                var result = _profileService.GetEmployerList();
                return Json(new { Success = true, Data = result });
            }
            catch (MongoException e)
            {
                return Json(new { Success = false, e.Message });
            }
        }

        [HttpPost("getEmployerListFilter")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        public IActionResult GetEmployerListFilter([FromBody]SearchCompanyModel model)
        {
            try
            {
                var result = _profileService.GetEmployerListByFilterAsync(model);//change to filters
                if (result.IsCompletedSuccessfully)
                    return Json(new { Success = true, Data = result.Result });
                else
                    return Json(new { Success = false, Message = "No Results found" });
            }
            catch (MongoException e)
            {
                return Json(new { Success = false, e.Message });
            }
        }

        [HttpPost("getTalentListFilter")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetTalentListFilter([FromBody] SearchTalentModel model)
        {
            try
            {
                var result = _profileService.GetTalentListByFilterAsync(model);//change to filters
                return Json(new { Success = true, Data = result.Result });
            }
            catch (MongoException e)
            {
                return Json(new { Success = false, e.Message });
            }
        }

        [HttpGet("getSuggestionList")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        public IActionResult GetSuggestionList(string employerOrJobId, bool forJob)
        {
            try
            {
                var result = _profileService.GetSuggestionList(employerOrJobId, forJob, _userAppContext.CurrentUserId);
                return Json(new { Success = true, Data = result });
            }
            catch (MongoException e)
            {
                return Json(new { Success = false, e.Message });
            }
        }

        [HttpPost("addTalentSuggestions")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        public async Task<IActionResult> AddTalentSuggestions([FromBody] AddTalentSuggestionList talentSuggestions)
        {
            try
            {
                if (await _profileService.AddTalentSuggestions(talentSuggestions))
                {
                    return Json(new { Success = true });
                }

            }
            catch (Exception e)
            {
                return Json(new { Success = false, e.Message });
            }
            return Json(new { Success = false });
        }

        #endregion


        #region ManageClients

        [HttpGet("getClientList")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        public async Task<IActionResult> GetClientList()
        {
            try
            {
                var result=await _profileService.GetClientListAsync(_userAppContext.CurrentUserId);

                return Json(new { Success = true, result });
            }
            catch(Exception e)
            {
                return Json(new { Success = false, e.Message });
            }
        }

        //[HttpGet("getClientDetailsToSendMail")]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "recruiter")]
        //public async Task<IActionResult> GetClientDetailsToSendMail(string clientId)
        //{
        //    try
        //    {
        //            var client = await _profileService.GetEmployer(clientId);

        //            string emailId = client.Login.Username;
        //            string companyName = client.CompanyContact.Name;

        //            return Json(new { Success = true, emailId, companyName });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { Success = false, Message = e.Message });
        //    }
        //}

        #endregion

        public IActionResult Get() => Content("Test");

    }
}
