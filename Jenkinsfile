node {  
  stage('SCM Checkout usermodule_ui'){  
    git branch: 'dev_master',credentialsId: 'jenkins-codecommit', url: 'https://git-codecommit.ap-south-1.amazonaws.com/v1/repos/usermodule_ui'  
  } 
 def commitSha = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
    println("commitSha: ${commitSha}")
    sh "sed -i 's/usermodule-ui:BUILDNUMBER/dev:usermodule_ui_${BUILD_NUMBER}_${commitSha}/' $WORKSPACE/k8s-config.yaml"
  stage('build source'){
      sh 'cp package*.json ./src/app/'  
      sh 'npm install'  
      sh 'npm run build  --output-path=./dist'  
  }
  stage('build docker image'){  
     sh label: '', script: "docker build -t 183454673550.dkr.ecr.ap-south-1.amazonaws.com/dev:usermodule_ui_${BUILD_NUMBER}_${commitSha} ."
  }  
  stage('push ECR_Dev'){  
     withDockerRegistry(credentialsId: 'ecr:ap-south-1:Jenkins-ECR', url: 'https://183454673550.dkr.ecr.ap-south-1.amazonaws.com/dev') {  
            sh "docker push 183454673550.dkr.ecr.ap-south-1.amazonaws.com/dev:usermodule_ui_${BUILD_NUMBER}_${commitSha}"  
         }  
    }
     stage('dev'){
     sh "kubectl apply -f $WORKSPACE/k8s-config.yaml"
    }
  stage('Email notification') {
    mail from: 'devops@safexpress.com',
      to: 'devops@safexpress.com',
      subject: "Approval",
      body: "Check dev eks cluster if all ok then deploy into test eks"
    }
   stage('Deployment approval'){
    input "dev to ECR_QA?"
   }
  stage('build source'){ 
    sh "sed -i 's/internal-a4442250f27aa11ea9bac0a3257c4306-879971059.ap-south-1.elb.amazonaws.com/internal-a83758738306a11eaa69b0a7ef785cff-1040806451.ap-south-1.elb.amazonaws.com/' $WORKSPACE/src/assets/json/config.json" 
    sh "sed -i 's/internal-af19f2c033c4111ea9bac0a3257c4306-911222744.ap-south-1.elb.amazonaws.com/internal-a9f66b275426d11eaa69b0a7ef785cff-1320506385.ap-south-1.elb.amazonaws.com/' $WORKSPACE/src/assets/json/config.json" 
    sh 'cp package*.json ./src/app/'  
    sh 'npm install'  
    sh 'npm run build  --output-path=./dist'  
  }
stage('docker image test'){   
   sh "sed -i 's/dev/qa/' $WORKSPACE/k8s-config.yaml"
   sh label: '', script: "docker build -t 183454673550.dkr.ecr.ap-south-1.amazonaws.com/qa:usermodule_ui_${BUILD_NUMBER}_${commitSha} ."
  }  
  stage('push ECR_Test'){  
     withDockerRegistry(credentialsId: 'ecr:ap-south-1:Jenkins-ECR', url: 'https://183454673550.dkr.ecr.ap-south-1.amazonaws.com/qa') {  
            sh "docker push 183454673550.dkr.ecr.ap-south-1.amazonaws.com/qa:usermodule_ui_${BUILD_NUMBER}_${commitSha}"  
         }  
    }
   stage('test'){   
        sh '''  
        export KUBECONFIG=/var/lib/jenkins/.kube/test-config 
        ECR_PASSWORD=$(aws --profile ECR ecr get-login | awk '{print $6}')  
        kubectl delete secret aws-ecr --ignore-not-found=true  
        kubectl create secret docker-registry aws-ecr --docker-server="https://183454673550.dkr.ecr.ap-south-1.amazonaws.com" --docker-username="AWS" --docker-password="${ECR_PASSWORD}" 
        kubectl apply -f $WORKSPACE/k8s-config.yaml 
        '''  
    }  
} 