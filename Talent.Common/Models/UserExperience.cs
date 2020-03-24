﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Talent.Common.Contracts;
using System.Collections.Generic;
using System.Text;

namespace Talent.Common.Models
{
    public class UserExperience: IMongoCommon // new
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }
        public String Company { get; set; }
        public String Position { get; set; }
        public String Responsibilities { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public bool IsDeleted { get; set; }
    }
}
