desc "Build binaries"
task :build do |task|
  system('npm install') or exit 1
  system('npm run bower -- cache clean') or exit 1
  system('npm run bower -- install --production') or exit 1
  system('angular_config hash -c config.dist.json > config.json') or exit 1
  system('npm run build -- --dist=./dist') or exit 1
end
