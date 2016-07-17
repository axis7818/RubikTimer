function cubeScramble(length, dim) {
   if (isNaN(length) || length < 0)
      length = 0;
   if (isNaN(dim) || dim < 2)
      dim = 2;

   var edges = ['R', 'L', 'U', 'D', 'F', 'B'];
   var sideLen = Math.floor(dim / 2);

   var result = [];
   var last = 'X';
   for (var i = 0; i < length; i++) {
      var move = last;
      while (move === last)
         move = edges[Math.floor(Math.random() * edges.length)];
      last = move;

      var depth = Math.ceil(Math.random() * sideLen);
      if (depth > 1)
         move += "<sub>" + depth + "</sub>";

      var rand = Math.random();
      if (rand <= 0.33)
         move += "'";
      else if (rand <= 0.66)
         move += "2";

      result[i] = move;
   }
   return result.join(' ');
}

var Scramble = function(format, length) {
   this.length = length;
   if (!Scramble.Formats[format])
      format = "3x3";
   this.format = format;

   return this;
};

Scramble.Formats = {
   "3x3": {
      generate: function(length) {
         return cubeScramble(length, 3);
      },
   },
   "4x4": {
      generate: function(length) {
         return cubeScramble(length, 4);
      },
   },
   "5x5": {
      generate: function(length) {
         return cubeScramble(length, 5);
      },
   },
};

Scramble.prototype.generate = function() {
   return Scramble.Formats[this.format].generate(this.length);
};

module.exports = Scramble;
