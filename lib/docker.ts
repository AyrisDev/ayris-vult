import { execSync } from 'child_process';

export const getContainers = () => {
  try {
    const output = execSync('curl --unix-socket /var/run/docker.sock http://localhost/v1.41/containers/json').toString();
    return JSON.parse(output);
  } catch (error) {
    console.error('Docker socket access failed:', error);
    return [];
  }
};

export const runBackup = (
    containerName: string | null, 
    dbUser: string | null, 
    dbName: string | null, 
    outputFile: string,
    connectionUrl: string | null = null,
    dbType: string = 'postgres'
) => {
  try {
    if (connectionUrl) {
      // Direct URL-based backup (Cloud or Remote Node)
      console.log(`[AyrisVult] Running remote backup via URL for type: ${dbType}`);
      let cmd = '';
      if (dbType === 'postgres') {
        cmd = `pg_dump "${connectionUrl}" > "${outputFile}"`;
      } else if (dbType === 'mysql') {
        cmd = `mysqldump "${connectionUrl}" > "${outputFile}"`;
      } else {
        throw new Error(`Unsupported remote backup type: ${dbType}`);
      }
      execSync(cmd);
      return true;
    } else if (containerName) {
      // Local Docker-based backup
      console.log(`[AyrisVult] Running local Docker backup for container: ${containerName}`);
      const execCmd = `curl --unix-socket /var/run/docker.sock -X POST "http://localhost/v1.41/containers/${containerName}/exec" -H "Content-Type: application/json" -d '{"Cmd": ["pg_dump", "-U", "${dbUser}", "${dbName}"], "AttachStdout": true}'`;
      const execRes = JSON.parse(execSync(execCmd).toString());
      const startCmd = `curl --unix-socket /var/run/docker.sock -X POST "http://localhost/v1.41/exec/${execRes.Id}/start" -H "Content-Type: application/json" -d '{}'`;
      const backupData = execSync(startCmd);
      require('fs').writeFileSync(outputFile, backupData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Backup execution failed:', error);
    return false;
  }
};
