pipeline {
    agent any

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
                    ansible-playbook -i ~/workspace/ansible/hosts.yaml -l gcloud-frontend-server ~/workspace/ansible/playbooks/website.yaml --vault-password-file ~/workspace/.vaultpass -e "backend_server_host='10.132.0.6'"
                '''
            }
        }

    }
}