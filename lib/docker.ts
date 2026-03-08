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

export const runBackup = (containerName: string, dbUser: string, dbName: string, outputFile: string) => {
  try {
    const cmd = `curl --unix-socket /var/run/docker.sock -X POST "http://localhost/v1.41/containers/${containerName}/exec" -H "Content-Type: application/json" -d '{"Cmd": ["pg_dump", "-U", "${dbUser}", "${dbName}"], "AttachStdout": true}'`;
    const execRes = JSON.parse(execSync(cmd).toString());
    const startCmd = `curl --unix-socket /var/run/docker.sock -X POST "http://localhost/v1.41/exec/${execRes.Id}/start" -H "Content-Type: application/json" -d '{}'`;
    const backupData = execSync(startCmd);
    // Save to disk
    require('fs').writeFileSync(outputFile, backupData);
    return true;
  } catch (error) {
    console.error('Backup execution failed:', error);
    return false;
  }
};
