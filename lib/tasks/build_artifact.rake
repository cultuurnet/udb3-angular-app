desc "Create a debian package from the binaries."
task :build_artifact do |task|

  calver_version = ENV['PIPELINE_VERSION'].nil? ? Time.now.strftime("%Y.%m.%d.%H%M%S") : ENV['PIPELINE_VERSION']
  git_short_ref  = `git rev-parse --short HEAD`.strip
  version        = ENV['ARTIFACT_VERSION'].nil? ? "#{calver_version}+sha.#{git_short_ref}" : ENV['ARTIFACT_VERSION']
  artifact_name  = 'uitdatabank-angular-app'
  vendor         = 'publiq VZW'
  maintainer     = 'Infra publiq <infra@publiq.be>'
  license        = 'Apache-2.0'
  description    = 'AngularJS frontend for UiTDatabank 3'
  source         = 'https://github.com/cultuurnet/udb3-angular-app/'

  FileUtils.mkdir_p('pkg')

  system("fpm -s dir -t deb -n #{artifact_name} -v #{version} -a all -p pkg \
    -x Jenkinsfile -x 'Gemfile*' -x vendor -x .bundle -x lib -x Rakefile -x '.git*' \
    --prefix /var/www/udb3-app \
    --before-remove lib/tasks/prerm -C dist \
    --depends rubygem-angular-config \
    --deb-user www-data --deb-group www-data \
    --description '#{description}' --url '#{source}' --vendor '#{vendor}' \
    --license '#{license}' -m '#{maintainer}' \
    --deb-field 'Pipeline-Version: #{calver_version}' \
    --deb-field 'Git-Ref: #{git_short_ref}' \
    ."
  ) or exit 1
end
