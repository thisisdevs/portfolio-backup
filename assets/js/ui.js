//parallax hero-image
$(document).scroll(function(){
  $('#ind-profile-btn').toggleClass('active-now',$(document).scrollTop() > ($('.hero-image').height()/2) && $(document).scrollTop()<($('.hero-image').height()+4*$('.profile').height()/5));
  $('#ind-projects-btn').toggleClass('active-now',$(document).scrollTop()>($('.hero-image').height()+4*$('.profile').height()/5));


  if($(document).scrollTop() < $(".profile").offset().top){
  //console.log($(document).scrollTop());
  $('.hero-image').css({
    "background-position":"center "+String($(this).scrollTop()/2)+"px"
  });
}

});


//indicator-bar-buttons

$('.ind-item').click(function(){
  //console.log("clicked");
  $('html, body').animate({
        scrollTop: $($(this).attr('data-link')).offset().top
    }, 300);
});



//firebase logic
const dbase = firebase.database();
const skillDbRef = dbase.ref().child('skills');
const projectRef = dbase.ref().child('projects');
const storage = firebase.storage();
const ThumbnailsRef = storage.ref().child('project-thumbnails');
let skillName, skillValue;
skillDbRef.once('value').then(function(snapshot){
  for(var prop in snapshot.val()){
    var obj = snapshot.val()[prop];

    skillName = obj['name'];
    skillValue = obj['value'];
    //console.log(skillName,skillValue);
    addSkillToProfile(skillName,skillValue);
  }
}).then(function(){
  $('.skills-box').find('.loader').remove();
});
let projects = {};
let pIDs = [];

projectRef.once('value').then(function(snapshot){
  for(var prop in snapshot.val()){
    var obj = snapshot.val()[prop];
    pIDs.push(obj['pid']);
    projects[obj['pid']] = obj;
  }
}).then(function(){
  pIDs.forEach(function(item){

      let pid, pcolor, phead, pdetails, pImgUrl, pImgAlt = "project thumbnail";
      pid = item;
      pcolor = projects[item]['pcolor'];
      phead = projects[item]['phead'];
      pdetails = projects[item]['pdetails'];
      pImgUrl = projects[item]['pImgUrl'];
      console.log(pid,pcolor,phead,pdetails,pImgUrl);
      $('.project-box').append('<div class="project" data-color= \"'+pcolor+'\" data-id=\"'+pid+'\" style=\"background-color:'+pcolor+'\"><h3>'+phead+'</h3><div class="img" style=\"background-image:url('+pImgUrl+')\"></div><p>'+pdetails+'</p>');
    });

}).then(function(){
  $('.project-box').find('.loader').remove();
  $('.project').click(function(){
    showModal($(this).attr('data-id'),$(this).attr('data-color'));
  });
});

$('.project-modal').find('.close-btn h2').click(function(){
  $('.project-modal').css({
    'display':'none'
  });
});

$('.project-modal').find('.content .loader').hide();

function showModal(pid,pcolor){
  $('.project-modal').css({
    'display':'block'
  });
  $('.project-modal').find('.content .loader').show();
  $('.project-modal').find('.content .content-wrap').remove();
  $('.project-modal').find('.close-btn h1').text("");
  var pdRef = dbase.ref('/projectDetails/'+pid);
  pdRef.once('value').then(function(snapshot){
    let title = snapshot.val()['Title'];
    let ImgUrl = snapshot.val()['Img'];
    let link = snapshot.val()['Link'];
    let TechUsed = snapshot.val()['TechUsed'];
    let para = snapshot.val()['para'];
    var content_wrap = document.createElement('div');
    $('.project-modal').find('.close-btn h1').text(title);
    $('.project-modal').find('.close-btn').css({
      'background-color':pcolor
    });
    var content_wrap = document.createElement('div');
    content_wrap.className = 'content-wrap';
    var banner = document.createElement('div');
    banner.className = 'project-banner';
    var linkToProj = document.createElement('a');
    linkToProj.href = link;
    linkToProj.textContent = "See Project";
    banner.appendChild(linkToProj);

    banner.style.backgroundImage = "url(" + ImgUrl +")";
    content_wrap.appendChild(banner);

    var h2 = document.createElement('h2');
    h2.textContent = "About";
    content_wrap.appendChild(h2);

    var p = document.createElement('p');
    p.textContent = para;
    content_wrap.appendChild(p);

    var h22 = document.createElement('h2');
    h22.textContent = "Technology Used";
    content_wrap.appendChild(h22);

    var ul = document.createElement('ul');
    for(var thing in TechUsed){
      console.log(thing);
      var li = document.createElement('li');
      li.textContent = thing;
      ul.appendChild(li);
    }
    content_wrap.appendChild(ul);
    document.querySelector('.content').appendChild(content_wrap);
  }).then(function(){
      $('.project-modal').find('.content .loader').hide();
  })
};





function addSkillToProfile(name,value) {
  $('#core').append('<div class="skill"><h4>'+name+'</h4><div class="bar-total"><div class="bar-actual" style=\"width:'+value+';\"></div></div></div>');
}
const mq = window.matchMedia( "(max-width: 850px)" );
const uielref = dbase.ref().child('uielements');
let profileHeight;
uielref.once('value').then(function(snapshot){
  if (mq.matches) {
    $('.profile').css({
      'height':snapshot.val()['profileHeightPT']
    });
  } else {
    $('.profile').css({
      'height':snapshot.val()['profileHeightLS']
    });
  }
});
