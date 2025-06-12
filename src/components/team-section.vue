<script lang="ts" setup>
import HomeDisclosure from "./home-disclosure.vue";
import Vita from "./vita.vue";
</script>

<template>
	<section>
		<div class="mx-auto max-w-5xl p-8">
			<HomeDisclosure title="Team">
				<div class="flex flex-col gap-8">
					<Vita
						bio="ist Politik- und Religionswissenschaftlerin und leitet YouBeOn. In ihrer Forschung
								beschäftigt sich Astrid mit Fragen des Zusammenlebens in (religiös) pluralen
								Gesellschaften, mit Governance von Diversität in liberalen Demokratien, Islam in
								Europa und der Schnittstelle von Migration und Religion."
						image="astrid-mattes.png"
						name="Astrid Mattes"
						pid="https://orcid.org/0000-0002-6912-7187"
					/>
					<Vita
						bio="ist Politikwissenschaftler und Leiter von YouBeOn. Seine Forschungsschwerpunkte
								liegen im Bereich soziologische Religionsforschung, Stadt-, Diversitäts- und
								Jugendkulturforschung."
						image="christoph-novak.png"
						name="Christoph Novak"
						pid="https://orcid.org/0000-0003-0563-7572"
					/>
					<Vita
						bio="	ist Politikwissenschafterin mit einem Schwerpunkt auf Stadt- und Regionalforschung.
								In ihrer Forschung beschäftigt sie sich mit gesellschaftlichen
								Transformationsprozessen in urbanen und ländlichen Räumen."
						image="miriam-haselbacher.png"
						name="Miriam Haselbacher"
						pid="https://orcid.org/0000-0002-9488-3291"
					/>
					<Vita
						bio="ist Religionswissenschaftlerin und Soziologin. Sie interessiert sich für Religion
								und Migration, insbesondere Hinduismen in Europa, Verhandlung religiöser
								Zugehörigkeit bei jungen Menschen sowie aktuelle Entwicklungen an der Schnittstelle
								von Religion und Politik, insbesondere im Hinblick auf Anti-Genderismus."
						image="katharina-limacher.png"
						name="Katharina Limacher"
						pid="https://orcid.org/0000-0003-0627-8946"
					/>
					<div>
						<p>
							Technisch umgesetzt wurde die YouBeOn Map von Stefan Probst, Matej Durco, Markus
							Hasenberger und Ludwig Maximilian Breuer.
						</p>
						<p>
							Das YouBeOn-Design gestaltete Eva Rauer (emailto:
							<a href="mailto:eva@rau.design">eva@rau.design</a>).
						</p>
						<p>
							Das Projekt wurde von einem hochkarätigen Scientific Advisory Board unterstützt. Wir
							bedanken uns bei
							<a
								href="https://www.unilu.ch/fakultaeten/kultur-und-sozialwissenschaftliche-fakultaet/institute/religionswissenschaftliches-seminar/mitarbeitende/martin-baumann/#tab=c1288"
								>Martin Baumann</a
							>, <a href="https://giuliaevolvi.com/">Giulia Evolvi</a>,
							<a
								href="https://www.sowi.hu-berlin.de/de/lehrbereiche/Integrationsforschung/integrationsforschung_MA/professuren"
								>Naika Foroutan</a
							>,
							<a
								href="https://www.uni-frankfurt.de/78330411/Professur_f%C3%BCr_Religionsp%C3%A4dagogik_und_Mediendidaktik"
								>Viera Pirker</a
							>
							und <a href="https://rw-ktf.univie.ac.at/lukas-k-pokorny/">Lukas Pokorny</a>.
						</p>
					</div>
				</div>
			</HomeDisclosure>
		</div>
	</section>
</template>
