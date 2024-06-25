pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('Github-Token')
        DOCKER_USER = 'Kostas-Xafis'
        DOCKER_SERVER = 'ghcr.io'
        DOCKER_PREFIX = 'ghcr.io/Kostas-Xafis/devops-frontend'
    }

    stages {
        stages('Checkout') {
            steps {
                git branch: 'main', url: 'git@github.com:Kostas-Xafis/DtstProjectFrontend.git'
            }
        }

        stage('Run ansible pipeline') {
            steps {
                build job: 'ansible'
            }
        }

        stage('Docker build and push') {
            steps {
                sh '''
                    HEAD_COMMIT=$(git rev-parse --short HEAD)
                    TAG=$HEAD_COMMIT-$BUILD_ID
                    docker build --rm -t $DOCKER_PREFIX:$TAG -t $DOCKER_PREFIX:latest .
                    echo $GITHUB_TOKEN | docker login $DOCKER_SERVER -u $DOCKER_USER --password-stdin
                    docker push $DOCKER_PREFIX --all-tags
                '''
            }
        }

        stage('Deploy frontend @ docker server') {
            steps {
                sh '''
                    export ANSIBLE_CONFIG=~/workspace/ansible/ansible.cfg
                    ansible-playbook -i ~/workspace/ansible/hosts.yaml -l docker-vm ~/workspace/ansible/playbooks/docker.yaml --vault-password-file ~/workspace/.vaultpass -e "docker_services=frontend"
                '''
            }
        }

    }
}