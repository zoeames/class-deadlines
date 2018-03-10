export const submitAssignmentServiceName = "submitAssignmentService";

export default class SubmitAssignmentService {
  constructor($http, $q, FIREBASE_CONFIG) {
    "ngInject";

    this.$http = $http;
    this.$q = $q;
    this.FB = FIREBASE_CONFIG;
  }

  postNewAssignment(data) {
    return this.$http.post(`${this.FB.databaseURL}/submitAssignments.json`, JSON.stringify(data));
  }

  getSubmitAssignmentsByUid(uid) {
    const assignments = [];
    return this.$q((resolve, reject) => {
      this.$http.get(`${this.FB.databaseURL}/submitAssignments.json?orderBy="uid"&equalTo="${uid}"`)
        .then((assignmentObject) => {
          const assignmentCollection = assignmentObject.data;
          Object.keys(assignmentCollection).forEach((key) => {
            assignmentCollection[key].submitAssignmentId = key;
            assignments.push(assignmentCollection[key]);
          });
          resolve(assignments);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateGithub(assignment){
    const githubUrl = assignment.githubUrl;
    return this.$http.patch(`${this.FB.databaseURL}/submitAssignments/${assignment.submitAssignmentId}.json`, JSON.stringify({ githubUrl }));
  }

  smashLists(assignments, myAssignments){
    for(let i=0; i<assignments.length; i++){
      let assignment = assignments[i];
      assignment.status = 'backlog';
      for(let j=0; j<myAssignments.length; j++){
        let myAssignment = myAssignments[j];
        if( assignment.assignmentId === myAssignment.assignmentId){
          assignment.githubUrl = myAssignment.githubUrl;
          assignment.status = myAssignment.status;
          assignment.submitAssignmentId = myAssignment.submitAssignmentId;
          assignment.isEditing = false;
        }
      }
    }
    return assignments;
  }
}