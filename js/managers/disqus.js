/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

function loadHomeDisqus() {

}

function loadDisqus(file) {
  DISQUS.reset({
      reload: true,
      config: function () {
          var id = file.id;
          console.log("Loading Disqus for this file: " + id);
          this.page.identifier = id;
          this.page.url = "http://kylevanderhoof.com/disqus.html?id=" + id;
          this.page.title = file.name;
      }
  });
}

var disqus_config = function () {
  this.page.url = "http://kylevanderhoof.com/";
  this.page.identifier = "HOME_PAGE";
  this.page.title = "Home Page";
};

(function() { // DON'T EDIT BELOW THIS LINE
  var d = document, s = d.createElement('script');
  s.type = 'text/javascript';
  s.src = 'http://idea-app.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();
