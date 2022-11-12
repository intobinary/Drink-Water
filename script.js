var tracker = document.getElementById('tracker'),
    trackerOffset = 0,
    app = document.getElementById('app'),
    water = document.getElementById('water'),
    cnt = document.getElementById('count'),
    percent = cnt.innerHTML,
    random, diff, interval, isInProgress;
var qty  = 0, maxQty = 4,
	user = "",
	start = false,
	btn,
	btn100 = document.querySelector('#button100'),
	btn50 = document.querySelector('#button50'),
	btn25 = document.querySelector('#button25');
	
checkUser();
checkTime();
setAppContent();

btn100.addEventListener('click', update);
btn50.addEventListener('click', update);
btn25.addEventListener('click', update);

function update() {
	btn = this;
	start = true;
	
  if((percent < 100) || (isInProgress == false)) {
//	if (isInProgress) return;

	  btn100.removeEventListener('click', update);
	  btn50.removeEventListener('click', update);
	  btn25.removeEventListener('click', update);

	  isInProgress = true;
	  
	  app.classList.add('app_animated');
	  setTimeout(function(){
		app.classList.remove('app_animated');
	  }, 1000);
	  
	  rotateTracker();
	var time1 = document.querySelector(".tracker__item:nth-last-child(3)").innerHTML;
	var time2 = document.querySelector(".tracker__item:nth-last-child(2)").innerHTML;
	var time3 = document.querySelector(".tracker__item:nth-last-child(1)").innerHTML;
	
	  setCookie("time1", time1);
	  setCookie("time2", time2);
	  setCookie("time3", time3);
	  
		var thing = parseFloat(btn.getAttribute("qty"));
		qty += thing;
		setCookie("qty", qty);
		
		random = (qty * 100) / maxQty;
	  
	  diff = percent - random;
	  random = Math.ceil(Math.abs(random));

	  interval = setInterval(function(){
		
		if (diff === 0 || percent === random) { 

		  btn100.addEventListener('click', update);
		  btn50.addEventListener('click', update);
		  btn25.addEventListener('click', update);

		  clearInterval(interval);
		  isInProgress = false;
		  return;
		}
		
		if (diff < 0) {
		  percent++;
		} else {
		  percent--;
		}
		
		if(percent <= 97) {
			water.style.transform = 'translate(0, ' + (100 - percent) + '%)';
		} else {
			percent = 100;
		}

		cnt.innerHTML = percent;
		water.querySelector('.water__inner').style.height = percent + '%';
		

		isInProgress = false;
	  }, 16);
	  
		checkTime();
  } else {
	  alert("Yaay! Congrats! Your water intake is healthy!");
  }
}


function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + (111 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkUser() {
  user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
		setCookie("username", user);
   }
  }
}

var pastTime, presentTime, countWaterDigested;
function checkTime() {
	countWaterDigested  = 0;
  pastTime = getCookie("time3");
  if (pastTime != "") {
	  presentTime = getTime();
	  
	 var timeDiff = strToMins(presentTime) - strToMins(pastTime);
	 // 0.1 litres every 36min
	 while(timeDiff > 36) {
		 timeDiff = timeDiff - 36;
		 waterDigested += 0.1;
	 }
	 alert(timeDiff + " <==> " + countWaterDigested);
	 
	  
//	  alert(pastTime + " - " + presentTime + " ==> " + strToMins(pastTime) - strToMins(presentTime));
  } else {
//    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
//	  setCookies();
    }
  }
}

	  function strToMins(t) {
		  var s = t.split(":");
		  return Number(s[0]) * 60 + Number(s[1]);
	  }
function setAppContent() {
	
};

function getTime() {
//  var time = new Date(Math.random() * 1000000000000),
  var time = new Date(),
      hours = time.getHours(),
      minutes = time.getMinutes();
  
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  
  time = hours + ':' + minutes;
  
  return time;
}

function rotateTracker() {
  var time = getTime(),
      firstElem = tracker.firstElementChild,
      computedStyle = getComputedStyle(firstElem),
      step = computedStyle.height,
      node = document.createElement('div');
  
  node.className = 'tracker__item tracker__item_active';
  node.innerHTML = time;
  
  tracker.querySelector('.tracker__item_active').className = 'tracker__item';

  trackerOffset = trackerOffset - parseInt(step);
//  console.log(trackerOffset);
  
  tracker.style.transform = 'translate( 0, ' + trackerOffset + 'px)';
    
  tracker.appendChild(node);
}