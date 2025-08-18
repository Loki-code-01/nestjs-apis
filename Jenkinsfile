pipeline {
    agent any

    environment {
        IMAGE_NAME = "postgres:15"
        CONTAINER_NAME = "postgres"
        PORT = "3000"
        ENV_FILE = ".env"
        EC2_USER = "ubuntu"
        EC2_IP = "54.226.129.25"
        SSH_CREDENTIALS_ID = "ec2-ssh-key"
        APP_DIR = "/home/ubuntu/nestjs-apis"
    }

    stages {
        stage('Deploy to EC2') {
            steps {
                sshagent([SSH_CREDENTIALS_ID]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_IP << 'ENDSSH'
                        set -e
                        
                        # Clone repo if not exists
                        if [ ! -d "$APP_DIR" ]; then
                            git clone https://github.com/Loki-code-01/nestjs-apis.git $APP_DIR
                        fi
                        
                        cd $APP_DIR
                        git pull origin main
                        
                        # Build new image
                        docker build -t $IMAGE_NAME .
                        
                        # Stop and remove old container if exists
                        docker rm -f $CONTAINER_NAME || true
                        
                        # Run new container
                        docker run -d --name $CONTAINER_NAME --env-file $ENV_FILE -p 80:$PORT $IMAGE_NAME
                        ENDSSH
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Visit: http://${EC2_IP}"
        }
        failure {
            echo "❌ Deployment failed. Check Jenkins logs."
        }
    }
}
