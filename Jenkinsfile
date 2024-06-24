pipeline {
    agent any

    environment {
        EMAIL_TO = 'koxafis@gmail.com'
    }

    stages {

        stage('Run ansible pipeline') {
            steps {
                build job: 'ansible'
            }
        }

        stage('Deploy frontend') {
            steps {
                sh '''
                    export ANSIBLE_CONFIG=~/workspace/ansible/ansible.cfg
                    ansible-playbook -i ~/workspace/ansible/hosts.yaml -l gcloud-frontend-server ~/workspace/ansible/playbooks/website.yaml --vault-password-file ~/workspace/.vaultpass
                '''
            }
        }
    }

    post {
        always {
            mail  to: "${EMAIL_TO}", body: "Project ${env.JOB_NAME} <br>, Build status ${currentBuild.currentResult} <br> Build Number: ${env.BUILD_NUMBER} <br> Build URL: ${env.BUILD_URL}", subject: "JENKINS: Project name -> ${env.JOB_NAME}, Build -> ${currentBuild.currentResult}"
        }
    }

}