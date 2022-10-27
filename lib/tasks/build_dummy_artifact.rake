require 'json'

desc "Create a debian package from the binaries."
task :build_dummy_artifact do |task|

  git_short_ref        = `git rev-parse --short HEAD`.strip
  artifact_name        = 'uitdatabank-angular'
  vendor               = 'publiq VZW'
  maintainer           = 'Infra publiq <infra@publiq.be>'
  license              = 'Apache-2.0'
  description          = 'AngularJS library for UiTDatabank 3 (dummy package)'
  source               = 'https://github.com/cultuurnet/udb3-angular-app/'

  bowerfile            = File.read('bower_components/udb3-angular/.bower.json')
  udb3_angular_data    = JSON.parse(bowerfile)
  angular_gitref       = udb3_angular_data['_resolution']['commit']
  short_angular_gitref = angular_gitref[0,7]

  calver_version       = ENV['PIPELINE_VERSION'].nil? ? Time.now.strftime("%Y.%m.%d.%H%M%S") : ENV['PIPELINE_VERSION']
  version              = "#{calver_version}+sha.#{short_angular_gitref}"

  puts "Angular_gitref = #{angular_gitref}"
  puts "Version = #{version}"

  FileUtils.mkdir_p('empty')

  system("fpm -s dir -t deb -n #{artifact_name} -v #{version} \
    -a all -p pkg -C empty \
    -x Jenkinsfile -x 'Gemfile*' -x vendor -x .bundle -x lib -x Rakefile -x '.git*' \
    --prefix /var/www/udb3-app \
    --description '#{description}' --url '#{source}' --vendor '#{vendor}' \
    --license '#{license}' -m '#{maintainer}' \
    --deb-field 'Pipeline-Version: #{calver_version}' \
    --deb-field 'Git-Ref: #{short_angular_gitref}' \
    ."
  ) or exit 1
end
