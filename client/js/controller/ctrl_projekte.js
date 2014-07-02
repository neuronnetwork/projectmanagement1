'use strict';

app.controller('ProjekteCtrl', function($scope, $http, $filter, $rootScope, $upload) {
	// all projects in list
	$scope.allProjects = [];
	
	// //console.log ('ProjekteCtrl $rootScope.user: ' + JSON.stringify($rootScope.user)); 

	// boolean: which div to show in rightcolumn
	$scope.showProjectEditDialog = false; 
	$scope.showNewProjectDialog = false;
	
	// show or hide divs with user feedback
	
	$scope.showErrorNewProject = false;
	$scope.showSuccessNewProject = false;
	
	// Feedback Messages
	$scope.alertErrorMessageNewProject = "";
	$scope.alertSuccessMessageNewProject = "";
 
	// string: if we add a new project - which title shoudl it have ??
	$scope.newProjectTitle = "";
	
	$scope.newTask = {}; 
	
	$scope.taskTypes = [ { humanreadable : 'Meilenstein', type: 'milestone' },
	                     { humanreadable : 'ToDo', type: 'task' },
	                     { humanreadable : 'Projektziel', type: 'projectgoal' }
	                   ];

	$scope.dateOptions = { 
			dateFormat: "dd.mm.yy",
	        firstDay: 1 
	};
	  
	$scope.newLink = {}; 
	
	
	
	
	
	// functions 
	// show the DIalog to let the user add a new project 
	$scope.OpenCreateNewProjectDialog  = function() {
		$scope.showProjectEditDialog = false; 
		$scope.showNewProjectDialog = true;
		
		$scope.newProjectTitle = "";		
	}
	
	// show the selected dialog in the tabs and panes 
	$scope.selectProject  = function(idx) {
		$scope.showProjectEditDialog = true; 
		$scope.showNewProjectDialog = false;
		
		$scope.selectedProject = $scope.allProjects[idx]; 
 		// //console.log('$scope.selectedProject: ' + JSON.stringify($scope.selectedProject));
	}
	 
	// send the new project name to the server and get the ID of the new project
 	$scope.createNewProject  = function() {
		 // //console.log('create new project');
		 
		 if ($scope.newProjectTitle == "") {
			 alert('Ha  ha - leerer Projekttitel macht wohl keinen Sinn');
		 } else {
			 // //console.log('checkin for user name and id');
//			 if ($rootScope.user == undefined) {
//				 // //console.log('username is undefined');
//				 $rootScope.user = {};
//				 $rootScope.user.id  = 43;  
//				 $rootScope.user.firstname = "dev";
//				 $rootScope.user.username = "dev";   
//
//			 } 

			 // get the new id and add the project to the array of projects
			 var json = {
					 projecttitle     : $scope.newProjectTitle,
					 etherpadTopics   : "topics", 
					 etherpadProtocol : "protocol",
					 userId			  : $rootScope.user.id
			 }; 
			 
			 $http({method: 'POST', url: '/newproject', data: json}).
	 	    	success(function(data, status, headers, config) { 
	 	    		// //console.log('success POST /newproject data: ' + JSON.stringify(data));
	 	    		$scope.showSuccessNewProject = true; 
	 	    		$scope.showErrorNewProject = false;
	 	    		$scope.alertSuccessMessageNewProject = "Projekt erfolgreich angelegt";  
	 	    		
	 	    		var newProject = data; 
	 	    		$scope.allProjects.push(newProject);
	 	    		
	 	    		// //console.log('success POST /newproject data: ' + JSON.stringify($scope.allProjects));

	 	    		
 			    }).
			    error(function(data, status, headers, config) {
	 	    		 
	 	    		$scope.showSuccessNewProject = false; 
	 	    		$scope.showErrorNewProject = true;
	 	    		$scope.alertErrorMessageNewProject = "Projekt konnte nicht angelegt werden";			    
	 	    	});  
		 } 
	}  
 	
 	$scope.combineProjectData = function(projects, etherpads, tasks, files) {
 		var dummy = []; 
 		
 		for (var i = 0; i < projects.length; i++) {
 			var project_uid = projects[i].uid; 
 			
 			var entry = {
 					uid : project_uid,
 					projecttitle : projects[i].project_title, 
 					etherpadtopic : {
 						id : -1, 
 						username : ""
 					}, 
 					etherpadprotocol : {
 						id : -1, 
 						username : ""
 					} 		
 			}; 
// 			if ($rootScope.user == undefined) {
//				 // //console.log('username is undefined');
//				 $rootScope.user = {};
//				 $rootScope.user.id  = -1;  
//				 $rootScope.user.firstname = "dev";   
//				 $rootScope.user.username = "dev";   
//			 }   
 			
 			for (var j = 0; j < etherpads.length; j++) {
 				if (etherpads[j].project_uid == project_uid) {
 					if (etherpads[j].name == "topics") {
 						entry.etherpadtopic.id = etherpads[j].uid; 
 						entry.etherpadtopic.username = $rootScope.user.firstname;
 					}
 					if (etherpads[j].name == "protocol") {
 						entry.etherpadprotocol.id = etherpads[j].uid;  
 						entry.etherpadprotocol.username = $rootScope.user.firstname;
 					}
 				}
 			}
 			entry.tasks = []; 
 			for (var j = 0; j < tasks.length; j++) {
 				if (tasks[j].project_uid == project_uid) {
 					
 					tasks[j].hideAttachments = true;
	 				tasks[j].hideLinks = true; 
 					tasks[j].hideComment = true; 
 					tasks[j].hideAddFileGroup = true;
 					tasks[j].hideAllDetails = true;
 					tasks[j].hideEditTask = true;
 					
 					entry.tasks.push(tasks[j]);
 				}
 			} 
 			entry.files  = []; 
 			for (var j = 0; j < files.length; j++) {
 				if (files[j].project_uid == project_uid) {  
 					entry.files.push(files[j]);
 				}
 			}  
 			dummy.push(entry);  				
 		}
 		return dummy; 
 	}
 	 
  	$scope.switchAllDetails = function(task ) {
  		// //console.log('switchAllDetails called');
  		
  		task.hideAllDetails = !task.hideAllDetails; 
  		
  		task.hideAttachments = task.hideAllDetails;
		task.hideLinks = task.hideAllDetails; 
		task.hideComment = task.hideAllDetails; 
   	}
 	
  	$scope.combineLinksAndTasks = function(tasks, links) {
 		var dummy = [];  
 		for (var i = 0; i < tasks.length; i++) {
 			var entry = tasks[i];
 			var task_uid = tasks[i].uid; 
 			entry.links = []; 
 			
 			for (var j = 0; j < links.length; j++) {
 				if (links[j].task_uid == task_uid) {
 					entry.links.push(links[j]);
 				}
 			} 
 			entry.hideAddLink = true;
 			dummy.push(entry);  				
 		}
 		return dummy; 		
 	}
 
  	$scope.combineFilesAndFileGroups = function(fileGroups, files) {
 		var dummy = [];  
 		for (var i = 0; i < fileGroups.length; i++) {
 			var entry = fileGroups[i];
 			var filegroup_uid = entry.uid; 
 			entry.files = []; 
 			
 			for (var j = 0; j < files.length; j++) {
 				if (files[j].filegroup_uid == filegroup_uid) {
 					entry.files.push(files[j]);
 				}
 			} 
 			dummy.push(entry);  
 			entry.hideAddFileGroup = true; 
 		}
 		return dummy; 		
 	}
  	
   	$scope.combineTasksAndFileGroups = function(tasks, fileGroups) {
 		var dummy = [];  
 		for (var i = 0; i < tasks.length; i++) {
 			var entry = tasks[i];
 			var task_uid = entry.uid; 
 			entry.fileGroups = []; 
 			
 			for (var j = 0; j < fileGroups.length; j++) {
 				if (fileGroups[j].task_uid == task_uid) {
 					entry.fileGroups.push(fileGroups[j]);
 				}
 			} 
 			dummy.push(entry);  				
 		}
 		return dummy; 		
 	}
   	
   	
 	// send the new project name to the server and get the ID of the new project
 	$scope.loadProjects  = function() {
		 // //console.log('load all projects');
		 $http({method: 'GET', url: '/projects'}).
	 	    	success(function(data, status, headers, config) { 
	 	    		var tasks = $scope.combineLinksAndTasks(data.tasks, data.links);
  	 	    		// //console.log('combineLinksAndTasks  tasks : ' + JSON.stringify(tasks)); 

	 	    		var fileGroups = $scope.combineFilesAndFileGroups(data.fileGroups, data.files);
  	 	    		// //console.log('combineFilesAndFileGroups  fileGroups : ' + JSON.stringify(fileGroups)); 

	 	    		tasks = $scope.combineTasksAndFileGroups(tasks, fileGroups); 
  	 	    		// //console.log('combineTasksAndFileGroups  tasks : ' + JSON.stringify(tasks)); 

	 	    		$scope.allProjects  = $scope.combineProjectData(data.projects, data.etherpads, tasks, data.files);  
  	 	    		// //console.log('$scope.allProjects : ' + JSON.stringify($scope.allProjects )); 
  			    }).
			    error(function(data, status, headers, config) {
	 	    		// //console.log('error GET /projects data: ' + JSON.stringify(data));	 
	 	    	});   
	}  
	
 	// --------------------- tasks  ----------------------
 	
 	function addTask(project_uid, task) {
 		task.hideAttachments = true;
		task.hideLinks = true; 
		task.hideComment = true; 
		task.hideAddFileGroup = true;
		task.hideAllDetails = true;
		task.hideEditTask = true;
		
		  //console.log('"addTask" - project_uid '+project_uid);
		  //console.log('"addTask" - task '+ JSON.stringify(task));	 

		  
		for (var i = 0; i < $scope.allProjects.length; i++) {
			//console.log('"addTask" - $scope.allProjects[i].uid  '+ $scope.allProjects[i].uid);

			if ($scope.allProjects[i].uid == project_uid) {
				$scope.allProjects[i].tasks.push(task);
				return i;
			}			
		}
		return -1; 
 	}
 
 	// 	send the new task get the ID of the new task
 	$scope.createNewTask  = function() {
		 // //console.log('create new task');
		 // //console.log('create new task $scope.newTask.txt:    ' + $scope.newTask.txt);

		 if ($scope.newTask.txt == "") {
			 alert('Haha - leerer Taskname macht wohl keinen Sinn');
		 } else {
			  //console.log('$scope.selectedProject '+ JSON.stringify($scope.selectedProject));
 			 
			 // get the new id and add the project to the array of projects
			 var json = {
					 task         : $scope.newTask.txt,					 
					 project_uid   : $scope.selectedProject.uid, 
					 user_uid	  : $rootScope.user.id,
					 // default values
					 type	  : 'task',
					 status : 'open',
 			 }; 
			 //console.log('create new task: sending json to server: ' + JSON.stringify(json));

			 $http({method: 'POST', url: '/newtask', data: json}).
	 	    	success(function(data, status, headers, config) { 
	 	    		 //console.log('success POST /newtask data: ' + JSON.stringify(data));
	 	    		$scope.showSuccessNewTask = true; 
	 	    		$scope.showErrorNewTask = false;
	 	    		$scope.alertSuccessMessageNewTask = "Task wurde erfolgreich angelegt";  
	 	    		
	 	    		var newTask = data; 
	 	    		newTask.firstname = $rootScope.user.firstname; 
	 	    		
	 	    		var idx = addTask( $scope.selectedProject.uid, newTask);
	 	    		if (idx > -1) {
		 	    		//console.log('success POST /newtask idx: ' + idx);
	 	    			$scope.selectProject(idx); 
	 	    		} else {
	 	    			// TODO
	 	    			//console.log('TODO: ERROR');
	 	    		}	 	         		
	 	    		
 			    }).
			    error(function(data, status, headers, config) {
	 	    		 
	 	    		$scope.showSuccessNewTask = false; 
	 	    		$scope.showErrorNewTask = true;
	 	    		$scope.alertErrorMessageNewTask = "Task konnte nicht angelegt werden";
	 	    		// //console.log('error POST /newtask data: ' + JSON.stringify(data));

	 	    	});  
		 } 
	}  
 	
 	function getActTask(task_uid) { 
		for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
			if ($scope.selectedProject.tasks[i].uid == task_uid) {
				return $scope.selectedProject.tasks[i];
			}							
		}
		return null; 
	} 
 	
 	function setActTaskStatus(task_uid, status) { 
 		var project_uid = $scope.selectedProject.uid; 
 		
		for (var i = 0; i < $scope.allProjects.length ; i++) {
			if ($scope.allProjects[i].uid == project_uid) {
				//console.log('found project');

				for (var j = 0; j < $scope.allProjects[i].tasks.length; j++) {
 					if ($scope.allProjects[i].tasks[j].uid == task_uid) {
						//console.log('found task');
						$scope.allProjects[i].tasks[j].statusDone = status;
						return; 
					}		
				}
			}							
		}
		return; 
	}  

 	$scope.changeTaskStatus  = function(task_uid, status ) {
 		//console.log('changeTaskStatus /task task_uid: ' + task_uid); 

   		setActTaskStatus(task_uid, status);
 		  
 		var dummy = 'open'; 
 		if (status) {
 			dummy = 'done'; 
 		}
 		var json = {
 				task_uid : task_uid,
 				status : dummy 
 		}
 		//console.log('"changeTaskStatus" - sending json to server: ' + JSON.stringify(json));
 		
 		$http({method: 'PUT', url: '/task/status', data: json}).
	    	success(function(data, status, headers, config) { 
	    		// //console.log('success PUT /task data: ' + JSON.stringify(data)); 
	    		$scope.alertSuccessMessageNewTask = "Task wurde erfolgreich upgedated";  
			 })
		    .error(function(data, status, headers, config) {
		    	// //console.log('error PUT /task data: ' + JSON.stringify(data));
	    	});  
 	}
 	
 	
 	$scope.saveTask = function(task_uid) { 
 		var json = {
 				task : getActTask(task_uid) 
 		}
 		
 		// TODO error!!
 		if (json == null) return;
    
 		// //console.log('updating task: sending json to server: ' + JSON.stringify(json));
    	// //console.log('updating task: url  : ' + JSON.stringify(url));
  
 		$http({method: 'PUT', url: '/task/data', data: json}).
	    	success(function(data, status, headers, config) { 
	    		// //console.log('success PUT /task data: ' + JSON.stringify(data)); 
	    		$scope.alertSuccessMessageNewTask = "Task wurde erfolgreich upgedated";  
  		    })
		    .error(function(data, status, headers, config) {
	    		// //console.log('error PUT /task data: ' + JSON.stringify(data));
 	    	});  
 	}
  
 	$scope.saveComment = function(task_uid) { 
 		var json = {
 				task : getActTask(task_uid) 
 		}
 		
 		// TODO error!!
 		if (json == null) return;
    
 		// //console.log('updating task: sending json to server: ' + JSON.stringify(json));
    	// //console.log('updating task: url  : ' + JSON.stringify(url));
  
 		$http({method: 'PUT', url: '/task/comment', data: json}).
	    	success(function(data, status, headers, config) { 
	    		// //console.log('success PUT /task data: ' + JSON.stringify(data)); 
	    		$scope.alertSuccessMessageNewTask = "Task Comment update wurde erfolgreich upgedated";  
  		    })
		    .error(function(data, status, headers, config) {
	    		// //console.log('error PUT /task data: ' + JSON.stringify(data));
 	    	});  
 	}
 	
 	
 		
 	// -------------------  FileGroups ------------------------------------
 	$scope.newfileGroup = {}; 
 	
 	$scope.addFileGroupToTask   = function(task_uid, project_uid, fileGroup) {
 		for (var i = 0; i < $scope.allProjects.length; i++) {
 			if ($scope.allProjects[i].uid == project_uid) {
 				for (var j = 0; j < $scope.allProjects[i].tasks.length; j++) {
 		 			if ($scope.allProjects[i].tasks[j].uid == task_uid) {
 		 				$scope.allProjects[i].tasks[j].fileGroups.push(fileGroup);
 		 				return;
 		 			} 			
 		 		}
 			} 			
 		}
 	}

 	$scope.createNewFileGroup  = function(task_uid) {
 		var json = {
 			description : $scope.newfileGroup.description,
 			task_uid  : task_uid 
		//	 userId	  : $rootScope.user.id
 		};
    	// //console.log('create new FileGroup: sending json to server: ' + JSON.stringify(json));

 		$http({method: 'POST', url: '/task/newfilegroup', data: json}).
	    	success(function(data, status, headers, config) { 
	    		// //console.log('success POST /newfilegroup data: ' + JSON.stringify(data));
//	    		$scope.showSuccessNewTask = true; 
//	    		$scope.showErrorNewTask = false;
	    		$scope.alertSuccessMessageNewTask = "FileGroup wurde erfolgreich angelegt";  
	    		
	    		var newFileGroup = data; 
	    		// // //console.log('$scope.selectedProject.: ' + JSON.stringify($scope.selectedProject, null, 4));  
	    		
	    		$scope.addFileGroupToTask(task_uid, $scope.selectedProject.uid, data);
	    		// $scope.selectedProject.fileGroups.push(newFileGroup);
 	     		 
	    		// //console.log('  $scope.allProjects: ' + JSON.stringify($scope.allProjects, null, 4));  

 		    }).
	    error(function(data, status, headers, config) {
	    		 
	    		$scope.showSuccessNewTask = false; 
	    		$scope.showErrorNewTask = true;
	    		$scope.alertErrorMessageNewTask = "Task FileGroup nicht angelegt werden";
	    		// //console.log('error POST /newfilegroup data: ' + JSON.stringify(data));

	    	});   
 	}
 	
 	function deleteFileGroupFromTask (task_uid, filegroup_uid, project_uid) {
 		for (var i = 0; i < $scope.allProjects.length; i++) {
 			if ($scope.allProjects[i].uid == project_uid) {
 				// //console.log('project_uid found = ' + $scope.allProjects[i].uid);

 				for (var j = 0; j < $scope.allProjects[i].tasks.length; j++) {
 		 			if ($scope.allProjects[i].tasks[j].uid == task_uid) {
 		 				// //console.log('task_uid found = '+$scope.allProjects[i].tasks[j].uid);

 		 				for (var k = 0; k < $scope.allProjects[i].tasks[j].fileGroups.length; k++) {
 		 		 			if ($scope.allProjects[i].tasks[j].fileGroups[k].uid == filegroup_uid) {
 		 		 				// //console.log('slicing index k = '+k);
 		 		 				$scope.allProjects[i].tasks[j].fileGroups.slice(k, 1);
  		 		 				return i;
 		 		 			} 			
 		 		 		} 
 		 			} 			
 		 		}
 			} 			
 		}
 		return -1; 
 	}
	
	
  	$scope.deleteFilegroup  = function(task_uid, filegroup_uid) { 
    	// //console.log('delete fileGroup: sending filegroup_uid to server: ' + filegroup_uid);

    	var url = '/task/filegroup/'+ filegroup_uid;
    	
 		$http({method: 'DELETE', url: url }).
	    	success(function(data, status, headers, config) {  
	    		$scope.alertSuccessMessageNewTask = "FileGroup wurde erfolgreich gelöscht";  
	    		var idx = deleteFileGroupFromTask(task_uid, filegroup_uid, $scope.selectedProject.uid); 
	    		
	    		if (idx > -1) {
	    			$scope.selectProject(idx);
	    		} else {
	    			//TODO 
	    			console.log('ERROR deleting filegroup');
	    		}
	    	}).
 		    error(function(data, status, headers, config) { 
	    		$scope.showSuccessNewTask = false; 
	    		$scope.showErrorNewTask = true;
	    		$scope.alertErrorMessageNewTask = "Task FileGroup nicht angelegt werden";
	    		// //console.log('error POST /newfilegroup data: ' + JSON.stringify(data)); 
	    	});   
 	}
 	
  	
  	
  	
 	// -------------------  Links ------------------------------------
  	
  	
  	function addLink(project_uid, task_uid, newLink) {
  		//console.log('"addLink" - project_uid '+project_uid);
  		//console.log('"addLink" - newLink '+ JSON.stringify(newLink));	 

  		for (var i = 0; i < $scope.allProjects.length; i++) {
  			//console.log('"addLink" - $scope.allProjects[i].uid  '+ $scope.allProjects[i].uid);
			if ($scope.allProjects[i].uid == project_uid) {
				for (var j = 0; j < $scope.allProjects[i].tasks.length; j++) {
  		  			//console.log('"addLink" - $scope.allProjects[i].tasks[j].uid  '+ $scope.allProjects[i].tasks[j].uid);
	  				if ($scope.allProjects[i].tasks[j].uid == task_uid) {
	  					$scope.allProjects[i].tasks[j].links.push(newLink);
	  					return i;
	  				}			
	  			}
			}			
		}
		return -1; 
  	}

  	$scope.addNewLink = function(task_uid) {
  		// get the new id and add the project to the array of projects
 		var json = {
				task_uid : task_uid,	
				url : $scope.newLink.url,
				linkname : $scope.newLink.linkname
		}; 
 		
		//console.log('create new link: sending json to server: ' + JSON.stringify(json));
		$http({method: 'POST', url: '/task/newlink', data: json}).
 	   		success(function(data, status, headers, config) { 
 	   			//console.log('success POST /task/newlink data: ' + JSON.stringify(data));
 	   		  
 	   			var newLink = data; 
 	   			var idx = addLink($scope.selectedProject.uid, task_uid, newLink);
 	   			if (idx > -1) {
 	   				//console.log('success POST /task/newlink idx: ' + idx);
 	   				$scope.selectProject(idx); 
 	   			} else {
 	   				// 	TODO
 	   				//console.log('TODO: ERROR');
 	   			}
 	   		}).
 	   		error(function(data, status, headers, config) {
 	    	 
 	    		$scope.showSuccessNewTask = false; 
 	    		$scope.showErrorNewTask = true;
 	    		$scope.alertErrorMessageNewTask = "Link konnte nicht gespeichert werden";
 	    		// //console.log('error POST /newtask data: ' + JSON.stringify(data));
 	   		}); 
  	} 
	
  	
 	// -------------------  add Files to a FileGroup ------------------------------------

  	
  	
  	function addFile(project_uid, task_uid, filegroup_uid, newFile) {
  		//console.log('"addFile" - project_uid '+project_uid);
  		//console.log('"addFile" - task_uid '+task_uid);
  		//console.log('"addFile" - filegroup_uid '+filegroup_uid); 
  		//console.log('"addFile" - newFile '+ JSON.stringify(newFile));	 

  		for (var i = 0; i < $scope.allProjects.length; i++) {
  			 console.log('"addFile" - $scope.allProjects[i].uid  '+ $scope.allProjects[i].uid);
			if ($scope.allProjects[i].uid == project_uid) {
				for (var j = 0; j < $scope.allProjects[i].tasks.length; j++) {
  		  			 console.log('"addFile" - $scope.allProjects[i].tasks[j].uid  '+ $scope.allProjects[i].tasks[j].uid);
	  				if ($scope.allProjects[i].tasks[j].uid == task_uid) {
	  					for (var k = 0; k < $scope.allProjects[i].tasks[j].fileGroups.length; k++) {
	  	  		  			 console.log('"addFile" - $scope.allProjects[i].tasks[j].fileGroups[k].uid  '+ $scope.allProjects[i].tasks[j].fileGroups[k].uid);
	  	  		  			 if ($scope.allProjects[i].tasks[j].fileGroups[k].uid == filegroup_uid) {
	  		  					console.log('"addFile" - $scope.allProjects[i].tasks[j].fileGroups '+ JSON.stringify($scope.allProjects[i].tasks[j].fileGroups));	 
	  		  					console.log('"addFile" - $scope.allProjects[i].tasks[j].fileGroups [k] '+ JSON.stringify($scope.allProjects[i].tasks[j].fileGroups[k]));	 

	  		  					$scope.allProjects[i].tasks[j].fileGroups[k].files.push(newFile);
	  		  					return i;
	  		  				}			
	  		  			}
	  				}			
	  			}
			}			
		}
		return -1; 
  	}
  	
  	
  	$scope.addFilesToFileGroup = function($files, filegroup_uid, task_uid) {
  		//console.log('fileUpload - $files: ' + JSON.stringify($files));
  		//console.log('fileUpload - filegroup_uid: ' + JSON.stringify(filegroup_uid));
  		
  		var json = {
  				user_uid : $rootScope.user.id,
  				username : $rootScope.user.username,
  				filegroup_uid : filegroup_uid
  		}
  		
  		for (var i = 0; i < $files.length; i++) {
  			var file = $files[i];
  				$scope.upload = $upload.upload({
  					url: '/task/fileupload', //upload.php script, node.js route, or servlet url
  					// method: POST or PUT,
  					// headers: {'headerKey': 'headerValue'},
  					// withCredentials: true,
  					data: json,
  					file: file,
		  	        // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
		  	        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
		  	        //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
		  	        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
		  	        //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
  					}).progress(function(evt) {
  						//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
  					}).success(function(data, status, headers, config) {
  						// file is uploaded successfully
  						 console.log('data: ' + JSON.stringify(filegroup_uid)); 
  						
  						var newFile = data.file; 
  						var idx = addFile($scope.selectedProject.uid, task_uid, filegroup_uid, newFile);
  		 	   			if (idx > -1) {
  		 	   				 console.log('success POST /task/newlink idx: ' + idx);
  		 	   				$scope.selectProject(idx); 
  		 	   			} else {
  		 	   				// 	TODO
  		 	   				console.log('TODO: ERROR');
  		 	   			} 
  					});
  					//.error(...)
  					//.then(success, error, progress); 
  	    }  		
  	}
  	
  	
  	$scope.downloadFile = function(file) {
   		var url = '/file/download/' + file.uid;
   		console.log('"downloadFile": url: ' + url);
   		window.open(url);
  	}
  	
  	
  	
  	// add Files to Project
  	
  	function addFileToProject(project_uid, newFile) {
  		for (var i = 0; i < $scope.allProjects.length; i++) {
  			console.log('"addFileToProject" - $scope.allProjects[i].uid  '+ $scope.allProjects[i].uid);
			if ($scope.allProjects[i].uid == project_uid) {
				$scope.allProjects[i].files.push(newFile);
	  		  	return i;
			}			
		}
		return -1; 
  	}
  	
  	
   	$scope.addFilesToProject = function($files, project_uid) {
   		
  		var json = {
  				user_uid : $rootScope.user.id,
  				username : $rootScope.user.username,
  				project_uid : project_uid
  		}
  		
  		console.log('addFilesToProject: project_uid: ' + project_uid);
  		
  		for (var i = 0; i < $files.length; i++) {
  			var file = $files[i];
  				$scope.upload = $upload.upload({
  					url: '/project/fileupload', //upload.php script, node.js route, or servlet url
  					// method: POST or PUT,
  					// headers: {'headerKey': 'headerValue'},
  					// withCredentials: true,
  					data: json,
  					file: file,
		  	        // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
		  	        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
		  	        //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
		  	        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
		  	        //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
  					}).progress(function(evt) {
  						//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
  					}).success(function(data, status, headers, config) {
  						// file is uploaded successfully
  						 console.log('data: ' + JSON.stringify(data)); 
  						
  						var newFile = data.file; 
  						var idx = addFileToProject(project_uid, newFile);
  		 	   			if (idx > -1) {
  		 	   				 console.log('success POST /task/newlink idx: ' + idx);
  		 	   				$scope.selectProject(idx); 
  		 	   			} else {
  		 	   				// 	TODO
  		 	   				console.log('TODO: ERROR');
  		 	   			} 
  					});
  					//.error(...)
  					//.then(success, error, progress); 
  	    }  		
  	}
  	
   	// TODO: better solution ?!?!
   	
   	if ($rootScope.user == undefined) {
   		console.log('PorjektCtrl - user is undefined');
   		$http.get('/loggedin').success(function(user) {
			// Authenticated
			if (user !== '0') { 
				$rootScope.user = user;
		    	$rootScope.isLoggedIn = true;
			} // Not Authenticated
			else {
				// $rootScope.message = 'You need to log in.';
				$rootScope.user = {};
		    	$rootScope.isLoggedIn = false;
			}
		});
   	}
   	
   	
  	// load all existing Projects
 	$scope.loadProjects();  
});
 
  
