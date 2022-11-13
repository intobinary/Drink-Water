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
	pastTime, presentTime, countWaterDigested = 0,
	btn100 = document.querySelector('#button100'),
	btn50 = document.querySelector('#button50'),
	btn25 = document.querySelector('#button25'),
	btnTimer = document.querySelector('#buttonTimer');
	

window.onload = function() {
//	setCookie("qty", 0);
	checkUser();
	checkTime();
	setAppContent();
	btnTimer.click();
	if(countWaterDigested > 0) {
	}
}

btn100.addEventListener('click', update);
btn50.addEventListener('click', update);
btn25.addEventListener('click', update);
btnTimer.addEventListener('click', update);

function update() {
	btn = this;
	start = true;
	
	checkTime();
	
  if((percent < 100) || (isInProgress == false)) {
//	if (isInProgress) return;

	  btn100.removeEventListener('click', update);
	  btn50.removeEventListener('click', update);
	  btn25.removeEventListener('click', update);
	  btnTimer.removeEventListener('click', update);

	  isInProgress = true;
	  
	  app.classList.add('app_animated');
	  setTimeout(function(){
		app.classList.remove('app_animated');
	  }, 1000);
	  
	  rotateTracker();
	  if(btn.getAttribute("id") != "buttonTimer") {
			

//			alert("HERE!");	  
		var thing = parseFloat(btn.getAttribute("qty"));
		qty += thing;
		if(qty < 0) {
			qty = 0;
		}
			setCookie("qty", qty);
			
			setCookie("time1", getCookie("time2"));
			setCookie("time2", getCookie("time3"));
			setCookie("time3", getTime());
			
//		alert("QTY: " + qty);
	  } else {
//		  alert("AAA");
	  }
	  
		random = (qty * 100) / maxQty;
	  
	  diff = percent - random;
	  random = Math.ceil(Math.abs(random));

	  interval = setInterval(function(){
		
		if (diff === 0 || percent === random) { 

		  btn100.addEventListener('click', update);
		  btn50.addEventListener('click', update);
		  btn25.addEventListener('click', update);
		  btnTimer.addEventListener('click', update);

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
	  
	setAppContent();
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
	qty = parseFloat(getCookie("qty"));
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
		setCookie("username", user);
		qty = 0;
   }
  }
}

function checkTime() {
  pastTime = getCookie("time3");
  if (pastTime != "") {
	  presentTime = getTime();
	  
	 var timeDiff = strToMins(presentTime) - strToMins(pastTime);
	 // 0.1 litres every 36min
//	 alert("time difference: " + timeDiff + " (" + presentTime + "/" + strToMins(presentTime) + " - " + pastTime + "/" + strToMins(pastTime) + ")");
	 while(timeDiff > 36) {
		 timeDiff = timeDiff - 36;
		 countWaterDigested += 0.1;
	 }
//	 alert("water digested in idle time: " + countWaterDigested);
	 
	 if(countWaterDigested > 0) {
		 var oldQty = getCookie("qty");
		 var newQty = oldQty - countWaterDigested;
			 qty = newQty;
		 if(qty < 0) {
			 qty = 0;
		 }
		 
		document.querySelector("#buttonTimer").setAttribute("qty", qty);
	 }
	  
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
	countWaterDigested = 0;
	
	document.querySelector(".tracker__item:nth-last-child(3)").innerHTML = getCookie("time1");
	document.querySelector(".tracker__item:nth-last-child(2)").innerHTML = getCookie("time2");
	document.querySelector(".tracker__item:nth-last-child(1)").innerHTML = getCookie("time3");

//	document.querySelector(".tracker__item:nth-last-child(3)").innerHTML = "AAA";
//	document.querySelector(".tracker__item:nth-last-child(2)").innerHTML = "GGG";
//	document.querySelector(".tracker__item:nth-last-child(1)").innerHTML = "VVV";
	
	document.querySelector("#buttonTimer").setAttribute("qty", qty);
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
  
 
	var time1 = document.querySelector(".tracker__item:nth-last-child(3)").innerHTML;
	var time2 = document.querySelector(".tracker__item:nth-last-child(2)").innerHTML;
	var time3 = document.querySelector(".tracker__item:nth-last-child(1)").innerHTML; 
		if((getCookie("time1") == "") && (getCookie("time2") == "") && (getCookie("time3") == "")) {
			setCookie("time1", time1);
			setCookie("time2", time2);
			setCookie("time3", time3);
		}
}